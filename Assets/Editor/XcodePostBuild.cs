using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using System.IO;

/// <summary>
/// Post-process build script to fix Xcode project issues
/// This script automatically removes the -ld64 linker flag that causes build failures
/// </summary>
public class XcodePostBuild
{
    [PostProcessBuild(1)]
    public static void OnPostProcessBuild(BuildTarget buildTarget, string pathToBuiltProject)
    {
        if (buildTarget != BuildTarget.iOS)
            return;

        string projectPath = pathToBuiltProject + "/Unity-iPhone.xcodeproj/project.pbxproj";

        UnityEngine.Debug.Log("[XcodePostBuild] Fixing Xcode project at: " + projectPath);

        // Read the project file
        string projectContent = File.ReadAllText(projectPath);

        // Count how many instances we're removing
        int countSimple = CountOccurrences(projectContent, "\t\t\tOTHER_LDFLAGS = \"-ld64\";");
        int countArray = CountOccurrences(projectContent, "\t\t\t\t\"-ld64\",");

        // Remove -ld64 from simple OTHER_LDFLAGS assignments
        projectContent = projectContent.Replace(
            "\t\t\tOTHER_LDFLAGS = \"-ld64\";",
            "\t\t\tOTHER_LDFLAGS = \"\";"
        );

        // Remove -ld64 from array-style OTHER_LDFLAGS
        projectContent = projectContent.Replace(
            "\t\t\t\t$CONFIGURATION_BUILD_DIR/il2cpp.a,\n\t\t\t\t\"-ld64\",",
            "\t\t\t\t$CONFIGURATION_BUILD_DIR/il2cpp.a"
        );

        // Write the modified content back
        File.WriteAllText(projectPath, projectContent);

        UnityEngine.Debug.Log($"[XcodePostBuild] ✓ Removed {countSimple + countArray} instances of -ld64 flag");
        UnityEngine.Debug.Log("[XcodePostBuild] ✓ Xcode project is now compatible with Xcode 26.1+");
    }

    private static int CountOccurrences(string text, string pattern)
    {
        int count = 0;
        int index = 0;
        while ((index = text.IndexOf(pattern, index)) != -1)
        {
            count++;
            index += pattern.Length;
        }
        return count;
    }
}
