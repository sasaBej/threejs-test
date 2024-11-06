import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function InteractiveModel({ url }) {
  const { scene } = useGLTF(url);

  // State for mesh colors, notes, and selected mesh
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [meshColors, setMeshColors] = useState({});
  const [meshNotes, setMeshNotes] = useState({});

  const handleMeshClick = (meshName) => {
    setSelectedMesh(meshName); // Set selected mesh for color and note
  };

  const handleColorChange = (color) => {
    // Update the color of the selected mesh
    setMeshColors((prev) => ({
      ...prev,
      [selectedMesh]: color,
    }));
    // Apply color immediately to mesh material if it's selected
    scene.getObjectByName(selectedMesh).material.color.set(color);
  };

  const handleAddNote = (note) => {
    // Add or update a note for the selected mesh
    setMeshNotes((prev) => ({
      ...prev,
      [selectedMesh]: note,
    }));
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <primitive
          object={scene}
          onClick={(e) => {
            e.stopPropagation();
            const clickedMesh = e.object;
            if (clickedMesh.isMesh) {
              handleMeshClick(clickedMesh.name);
            }
          }}
        >
          {scene.traverse((mesh) => {
            {
              /* {scene.children.map((mesh) => { */
            }
            console.log("Mesh:", mesh);
            if (mesh.isMesh) {
              // Set initial color if defined in meshColors
              if (meshColors[mesh.name]) {
                mesh.material.color.set(meshColors[mesh.name]);
              }

              return (
                <mesh
                  key={mesh.uuid}
                  geometry={mesh.geometry}
                  material={mesh.material}
                  onClick={() => handleMeshClick(mesh.name)}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    console.log("Hovered:", mesh.name);
                  }}
                  onPointerOut={(e) => e.stopPropagation()}
                />
              );
            }
            return null;
          })}
        </primitive>

        <OrbitControls />
      </Canvas>

      {selectedMesh && (
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <h3>Editing: {selectedMesh}</h3>
          {/* Color Picker */}
          <input
            type="color"
            value={meshColors[selectedMesh] || "#ffffff"}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          {/* Note Area */}
          <textarea
            placeholder="Add note here..."
            value={meshNotes[selectedMesh] || ""}
            onBlur={(e) => handleAddNote(e.target.value)}
          />
          <p>Note: {meshNotes[selectedMesh]}</p>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <InteractiveModel url="/currentModel.gltf" />
    </div>
  );
}
