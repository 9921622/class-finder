import { map } from "zod";
import { createClass } from "../models/Class";
import { createLocationNode, getAllLocationNodes } from "../models/LocationNode";


const baseUrl = process.env.BACKEND_URL || 'http://localhost:8080';
const ELW_front = `${baseUrl}/static/images/ELW_front.jpg`;
const ELW_entrance =  `${baseUrl}/static/images/ELW_entrance.jpg`;
const ELW_stairs =  `${baseUrl}/static/images/ELW_stairs.jpg`;
const ELW_stairsStart =  `${baseUrl}/static/images/ELW_stairsStart.jpg`;
const ELW_stairsEnd =  `${baseUrl}/static/images/ELW_stairsEnd.jpg`;
const ELW_hall1 =  `${baseUrl}/static/images/ELW_hall1.jpg`;
const ELW_hall2=  `${baseUrl}/static/images/ELW_hall2.jpg`;
const ELW_B215 =  `${baseUrl}/static/images/ELW_B215.jpg`;


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

function GenerateOutsideNodes() {
    const misc = [
        createLocationNode(
            "STAT 260",
            { latitude: 48.46380, longitude: -123.31340 }, 
            { tags: ["class"] }
        ),
        createLocationNode(
        "ELW",
        { latitude: 48.461176451647376,longitude: -123.31056195166656 }, 
        { tags: ["R-ELW1F", "REDIRECT"] }
        ),
    ]

    const route = [
        createLocationNode(
        "",
        { latitude: 48.46151439331123, longitude: -123.31069187798123 }, 
        { tags: [] }
        ),
        createLocationNode(
            "ELW - Entrance",
            { latitude: 48.46130, longitude: -123.31065 }, 
            { tags: ["R-ELW1F", "REDIRECT", "entrance"] }
        ),
    ];
    for (let i = 0; i < route.length; i++) {
        const node = route[i];
        const prevNode = route[i - 1];
        const nextNode = route[i + 1];

        if (prevNode) node.prevId = prevNode.id;
        if (nextNode) node.nextId = nextNode.id;
    }

    //
    [...misc, ...route]
        .map((n) => n.tags.push("OUTSIDE"))
}

function GenerateInteriorNodes() {  
    // ELW1F map ========================================
    const ELW1F = [
        createLocationNode(
            "Entrance",
            { latitude: -34, longitude: 86.60291688570543 }, 
            { tags: ["R-BASE", "REDIRECT"] }
        ),

        createLocationNode(
            "stairs",
            { latitude: -51.75, longitude: 86.3 }, 
            { tags: ["R-ELW2F", "REDIRECT"] }
        ),
        createLocationNode(
            "2nd Floor",
            { latitude: -51.75, longitude: 95.8674 }, 
            { tags: ["R-ELW2F", "REDIRECT"] }
        ),
    ];
    ELW1F.map((n) => n.tags.push("ELW1F"))
    for (let i = 0; i < ELW1F.length; i++) {
        const node = ELW1F[i];
        const prevNode = ELW1F[i - 1];
        const nextNode = ELW1F[i + 1];

        if (prevNode) node.prevId = prevNode.id;
        if (nextNode) node.nextId = nextNode.id;
    }

    // ELW2F map ============================================
    const ELW2F = [
        createLocationNode(  
            "1rst Floor",
            { latitude: -57, longitude: 97.829699 }, 
            { tags: ["R-ELW1F", "REDIRECT"] }
        ),

        createLocationNode( 
            "Hall 1",
            { latitude: -50, longitude: 93.032 }, 
            { tags: ["R-ELW1F", "REDIRECT"] }
        ),
        createLocationNode( 
            "Hall 2",
            { latitude: -50.2045, longitude: 56.298 }, 
            { tags: ["R-ELW1F", "REDIRECT"] }
        ),
        createLocationNode( 
            "B215 Lab",
            { latitude: -87.75, longitude: 56.5 }, 
            { tags: ["ELW2","class"] }
        ),
    ];
    ELW2F.map((n) => n.tags.push("ELW2F"))
    for (let i = 0; i < ELW1F.length; i++) {
        const node = ELW2F[i];
        const prevNode = ELW2F[i - 1];
        const nextNode = ELW2F[i + 1];

        if (prevNode) node.prevId = prevNode.id;
        if (nextNode) node.nextId = nextNode.id;
    }
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
            tags: ["route", "elw"],
            image: ELW_front,
        }
    );

    createLocationNode(
        "Node 0",
        { latitude: 48.46130, longitude: -123.31065 }, 
        { 
            prevId: 3,
            nextId: 5,    
            tags: ["route", "elw"],
            image: ELW_entrance,
        }
    );

    createLocationNode(
        "ELW Node 1",
        { latitude: 48.46120, longitude: -123.31065 },
        {
            prevId: 2,
            nextId: 6,
            tags: ["route", "elw"],
            image: ELW_stairs,
        }
    );

    createLocationNode(
        "ELW Node 2",
        { latitude: 48.46120, longitude: -123.31060 },
        {
            prevId: 5,
            nextId: 7,
            tags: ["route", "elw"],
            image: ELW_stairsStart,
        }
    );

    createLocationNode(
        "ELW 3 (Stairs)",
        { latitude: 48.46123, longitude: -123.31060 },
        {
            prevId: 6,
            nextId: 8,
            tags: ["route", "elw", "stairs"],
            image: ELW_stairsEnd,
        }
    );

    createLocationNode(
        "ELW Node 4",
        { latitude: 48.46126, longitude: -123.31060 },
        {
            prevId: 7,
            nextId: 9,
            tags: ["route", "elw"],
            image: ELW_hall1,

        }
    );

    createLocationNode(
        "ELW Node 5",
        { latitude: 48.46126, longitude: -123.31090 },
        {
            prevId: 8,
            nextId: 10,
            tags: ["route", "elw"],
            image: ELW_hall2,
        }
    );

    createLocationNode(
        "SENG 265 Room",
        { latitude: 48.46115, longitude: -123.31085 },
        {
            prevId: 9,
            tags: ["class","route","elw"],
            image: ELW_B215,
        }
    );

    // old map nodes
    const nodes = getAllLocationNodes();
    const last_id = nodes[nodes.length-1].id;
    nodes.forEach((n) => n.tags.push("map_v1"));

    // new map nodes
    GenerateOutsideNodes();
    GenerateInteriorNodes();
    nodes.forEach((n) => { if (n.id > last_id) n.tags.push("map_v2"); });


}

export default function GenerateData() {
    GenerateClasses();
    GenerateLocationNodes();
}