using UnityEngine;

/// <summary>
/// Spawns a simple colored cube to test AR positioning
/// This helps verify the spawn location is correct
/// </summary>
public class ARSpawnTestCube : MonoBehaviour
{
    [Header("Spawn Settings")]
    [Tooltip("Distance in front of camera (in meters)")]
    public float spawnDistance = 2.0f;

    [Tooltip("Size of the test cube")]
    public float cubeSize = 0.3f;

    [Tooltip("Vertical offset from camera height")]
    public float heightOffset = -0.5f;

    [Tooltip("Cube color")]
    public Color cubeColor = Color.red;

    private GameObject testCube;
    private Camera arCamera;

    void Start()
    {
        arCamera = Camera.main;

        if (arCamera == null)
        {
            Debug.LogError("No main camera found!");
            return;
        }

        Invoke(nameof(SpawnTestCube), 1.0f);
    }

    void SpawnTestCube()
    {
        // Create a cube
        testCube = GameObject.CreatePrimitive(PrimitiveType.Cube);
        testCube.name = "AR Test Cube";

        // Position it
        Vector3 spawnPosition = arCamera.transform.position + arCamera.transform.forward * spawnDistance;
        spawnPosition.y = arCamera.transform.position.y + heightOffset;
        testCube.transform.position = spawnPosition;

        // Scale it
        testCube.transform.localScale = Vector3.one * cubeSize;

        // Color it
        Renderer renderer = testCube.GetComponent<Renderer>();
        if (renderer != null)
        {
            Material mat = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            mat.color = cubeColor;
            renderer.material = mat;
        }

        Debug.Log($"Test cube spawned at {spawnPosition}");
    }
}
