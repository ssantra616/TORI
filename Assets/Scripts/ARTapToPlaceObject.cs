using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

/// <summary>
/// Tap to place the AR character on detected surfaces
/// </summary>
[RequireComponent(typeof(ARRaycastManager))]
public class ARTapToPlaceObject : MonoBehaviour
{
    [Header("Prefab to Spawn")]
    [Tooltip("Drag your character prefab here (e.g., BM_DemonLord2)")]
    public GameObject objectToPlace;

    [Header("Placement Settings")]
    [Tooltip("Scale of the spawned object")]
    public float spawnScale = 0.5f;

    [Tooltip("Only spawn one character")]
    public bool onlySpawnOnce = true;

    private ARRaycastManager raycastManager;
    private GameObject spawnedObject;
    private List<ARRaycastHit> hits = new List<ARRaycastHit>();

    void Awake()
    {
        raycastManager = GetComponent<ARRaycastManager>();
    }

    void Update()
    {
        // Check if we should only spawn once and already spawned
        if (onlySpawnOnce && spawnedObject != null)
            return;

        // Check for touch input
        if (Input.touchCount == 0)
            return;

        Touch touch = Input.GetTouch(0);

        // Only respond to touch began
        if (touch.phase != TouchPhase.Began)
            return;

        // Raycast against AR planes
        if (raycastManager.Raycast(touch.position, hits, TrackableType.PlaneWithinPolygon))
        {
            // Get the hit pose
            Pose hitPose = hits[0].pose;

            if (spawnedObject == null)
            {
                // Spawn new object
                spawnedObject = Instantiate(objectToPlace, hitPose.position, hitPose.rotation);
                spawnedObject.transform.localScale = Vector3.one * spawnScale;
                Debug.Log($"Spawned {objectToPlace.name} at {hitPose.position}");
            }
            else if (!onlySpawnOnce)
            {
                // Move existing object
                spawnedObject.transform.position = hitPose.position;
                spawnedObject.transform.rotation = hitPose.rotation;
            }
        }
    }
}
