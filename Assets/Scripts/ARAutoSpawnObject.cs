using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using System.Collections.Generic;

/// <summary>
/// Automatically spawns the AR character in front of the camera when the app starts
/// Waits for AR tracking and floor detection before placing on the ground
/// </summary>
public class ARAutoSpawnObject : MonoBehaviour
{
    [Header("Prefab to Spawn")]
    [Tooltip("Drag your character prefab here (e.g., BM_DemonLord2)")]
    public GameObject objectToSpawn;

    [Header("Spawn Settings")]
    [Tooltip("Distance in front of camera (in meters)")]
    public float spawnDistance = 2.0f;

    [Tooltip("Scale of the spawned object")]
    public float spawnScale = 1.0f;

    [Tooltip("Height offset above the floor (in meters)")]
    public float floorOffset = 0f;

    [Tooltip("Minimum delay before spawning (seconds) - waits for AR tracking")]
    public float minSpawnDelay = 1.0f;

    [Tooltip("Place on detected floor automatically")]
    public bool placeOnFloor = true;

    [Header("Rotation Fix")]
    [Tooltip("Additional rotation offset (in degrees) - use to fix tilted models")]
    public Vector3 rotationOffset = new Vector3(0f, 0f, 0f);

    [Header("Material Override")]
    [Tooltip("Override material with this color (leave default for no override)")]
    public Color overrideColor = new Color(0.6f, 0.2f, 1.0f, 1.0f); // Purple

    [Tooltip("Apply color override to materials")]
    public bool applyColorOverride = true;

    private GameObject spawnedObject;
    private Camera arCamera;
    private ARSession arSession;
    private ARRaycastManager raycastManager;
    private bool hasSpawned = false;
    private float timeSinceStart = 0f;

    void Start()
    {
        // Find the AR camera
        arCamera = Camera.main;

        if (arCamera == null)
        {
            Debug.LogError("No main camera found!");
            return;
        }

        if (objectToSpawn == null)
        {
            Debug.LogError("No prefab assigned to spawn!");
            return;
        }

        // Find AR session
        arSession = FindObjectOfType<ARSession>();
        if (arSession == null)
        {
            Debug.LogWarning("No ARSession found! Spawning without tracking check.");
            Invoke(nameof(SpawnObject), minSpawnDelay);
        }

        // Find AR raycast manager for floor detection
        raycastManager = FindObjectOfType<ARRaycastManager>();
        if (raycastManager == null && placeOnFloor)
        {
            Debug.LogWarning("No ARRaycastManager found! Cannot place on floor.");
            placeOnFloor = false;
        }
    }

    void Update()
    {
        // Handle spawning logic
        if (!hasSpawned && arSession != null)
        {
            timeSinceStart += Time.deltaTime;

            // Wait for minimum delay AND proper AR tracking
            if (timeSinceStart >= minSpawnDelay && ARSession.state == ARSessionState.SessionTracking)
            {
                SpawnObject();
            }
        }

    }

    void SpawnObject()
    {
        if (spawnedObject != null || hasSpawned)
        {
            Debug.LogWarning("Object already spawned!");
            return;
        }

        // Calculate horizontal spawn position in front of camera
        Vector3 cameraForward = arCamera.transform.forward;
        cameraForward.y = 0; // Keep it horizontal
        cameraForward.Normalize();

        Vector3 spawnPosition = arCamera.transform.position + cameraForward * spawnDistance;

        // Try to place on detected floor
        if (placeOnFloor && raycastManager != null)
        {
            List<ARRaycastHit> hits = new List<ARRaycastHit>();

            // Raycast downward from spawn position to find floor
            Vector3 rayOrigin = new Vector3(spawnPosition.x, arCamera.transform.position.y, spawnPosition.z);

            if (raycastManager.Raycast(rayOrigin, hits, TrackableType.PlaneWithinPolygon))
            {
                // Place on the detected floor
                spawnPosition = hits[0].pose.position;
                spawnPosition.y += floorOffset; // Apply floor offset
                Debug.Log("Placed on detected floor");
            }
            else
            {
                // No floor detected, use estimated floor position
                spawnPosition.y = arCamera.transform.position.y - 1.5f + floorOffset;
                Debug.LogWarning("No floor detected, using estimated position");
            }
        }
        else
        {
            // Place on floor is disabled, use camera height offset
            spawnPosition.y = arCamera.transform.position.y - 1.5f + floorOffset;
        }

        // Calculate rotation - face away from camera
        Vector3 lookDirection = new Vector3(cameraForward.x, 0, cameraForward.z);
        Quaternion spawnRotation = Quaternion.LookRotation(lookDirection, Vector3.up);

        // Apply rotation offset to fix tilted models
        spawnRotation *= Quaternion.Euler(rotationOffset);

        // Spawn the object (world-locked - it will stay in this position as you walk)
        spawnedObject = Instantiate(objectToSpawn, spawnPosition, spawnRotation);
        spawnedObject.transform.localScale = Vector3.one * spawnScale;

        // CRITICAL: Ensure object is NOT parented to anything (stays world-locked)
        spawnedObject.transform.SetParent(null);

        // Apply purple color override to all materials
        if (applyColorOverride)
        {
            Renderer[] renderers = spawnedObject.GetComponentsInChildren<Renderer>();
            foreach (Renderer renderer in renderers)
            {
                foreach (Material mat in renderer.materials)
                {
                    // Set material to use URP/Lit shader and apply purple color
                    if (mat.HasProperty("_BaseColor"))
                    {
                        mat.SetColor("_BaseColor", overrideColor);
                    }
                    if (mat.HasProperty("_Color"))
                    {
                        mat.SetColor("_Color", overrideColor);
                    }
                    // Add emission for purple glow
                    if (mat.HasProperty("_EmissionColor"))
                    {
                        mat.EnableKeyword("_EMISSION");
                        mat.SetColor("_EmissionColor", new Color(0.3f, 0.1f, 0.6f, 1.0f));
                    }
                }
            }
            Debug.Log($"Applied purple color override to {spawnedObject.name}");
        }

        hasSpawned = true;

        Debug.Log($"Auto-spawned {objectToSpawn.name} at {spawnPosition} (world-locked, parent: {spawnedObject.transform.parent})");
    }

    // Optional: Call this to respawn the object
    public void RespawnObject()
    {
        if (spawnedObject != null)
        {
            Destroy(spawnedObject);
        }
        hasSpawned = false;
        timeSinceStart = 0f;
    }
}
