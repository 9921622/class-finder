import { createClass } from "../models/Class";
import { createLocationNode } from "../models/LocationNode";


export function GenerateClasses() {
    createClass(
        "CSC 110",
        "ECS Building",
        "Room 123",
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
        "Engineering Lab Wing",
        "Room B215",
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
        { latitude: 48.46115, longitude: -123.31150 }, 
        { tags: ["class"] }
    );
    createLocationNode(
        "Math 200",
        { latitude: 48.46250, longitude: -123.31065 }, 
        { tags: ["class"] }
    );
    
    createLocationNode(
        "STAT 260",
        { latitude: 48.46380, longitude: -123.31340 }, 
        { tags: ["class"] }
    );

    createLocationNode(
        "SENG 265 Start",
        { latitude: 48.46140, longitude: -123.31065 }, 
        { 
            nextId: 4,    
            tags: ["route", "elw"] 
        }
    );

    createLocationNode(
        "Node 0",
        { latitude: 48.46130, longitude: -123.31065 }, 
        { 
            prevId: 3,
            nextId: 5,    
            tags: ["route", "elw"] 
        }
    );

    createLocationNode(
        "ELW Node 1",
        { latitude: 48.46120, longitude: -123.31065 },
        {
            prevId: 4,
            nextId: 6,
            tags: ["route", "elw"]
        }
    );

    createLocationNode(
        "ELW Node 2",
        { latitude: 48.46120, longitude: -123.31060 },
        {
            prevId: 5,
            nextId: 7,
            tags: ["route", "elw"]
        }
    );

    createLocationNode(
        "ELW 3 (Stairs)",
        { latitude: 48.46123, longitude: -123.31060 },
        {
            prevId: 6,
            nextId: 8,
            tags: ["route", "elw", "stairs"]
        }
    );

    createLocationNode(
        "ELW Node 4",
        { latitude: 48.46126, longitude: -123.31060 },
        {
            prevId: 7,
            nextId: 9,
            tags: ["route", "elw"]
        }
    );

    createLocationNode(
        "ELW Node 5",
        { latitude: 48.46126, longitude: -123.31090 },
        {
            prevId: 8,
            nextId: 10,
            tags: ["route", "elw"]
        }
    );

    createLocationNode(
        "SENG 265 Room",
        { latitude: 48.46115, longitude: -123.31085 },
        {
            prevId: 9,
            tags: ["class"]
        }
    );
}

export default function GenerateData() {
    GenerateClasses();
    GenerateLocationNodes();
}