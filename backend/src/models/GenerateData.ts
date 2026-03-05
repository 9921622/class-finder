import { createClass } from "../models/Class";
import { createLocationNode } from "../models/LocationNode";



export function GenerateClasses() {
    createClass(
        "CSC 110",
        "Engineering Lab Wing",
        "Room 108",
        "09:00",
        "10:20"
    );
    createClass(
        "Math 200",
        "Elliott Building",
        "Room 167",
        "11:30",
        "12:50"
    );
    createClass(
        "SENG 265",
        "ECS Building",
        "Room 124",
        "13:00",
        "14:20"
    );
    createClass(
        "STAT 260",
        "Cornett Building",
        "Room A120",
        "15:30",
        "16:50"
    );
}

export function GenerateLocationNodes() {
    createLocationNode(
        "CSC 110",
        { latitude: 0, longitude: 0 }, 
        { tags: ["class"] }
    );
    createLocationNode(
        "Math 200",
        { latitude: 0, longitude: 0 }, 
        { tags: ["class"] }
    );
    createLocationNode(
        "SENG 265",
        { latitude: 0, longitude: 0 }, 
        { tags: ["class"] }
    );
    createLocationNode(
        "STAT 260",
        { latitude: 0, longitude: 0 }, 
        { tags: ["class"] }
    );

    createLocationNode(
        "Node 1",
        { latitude: 0, longitude: 0 },
        
        // {
        //     prevId: 0,
        //     nextId: 2,
        //     tags: ["stairs"],
        //     image: "src", 
        // }
    );

    createLocationNode(
        "Node 2",
        { latitude: 0, longitude: 0 },
        { tags: ["tag1"] }
    );

    createLocationNode(
        "Node 3",
        { latitude: 0, longitude: 0 }
    );

    createLocationNode(
        "Node 4",
        { latitude: 0, longitude: 0 },
        { tags: ["tag2"] }
    );

    createLocationNode(
        "Node 5",
        { latitude: 0, longitude: 0 }
    );
}

export default function GenerateData() {
    GenerateClasses();
    GenerateLocationNodes();
}