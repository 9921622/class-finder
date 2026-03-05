
import React, { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";

import { mapAPI } from "~/APIWrapper";

import type { LocationNode } from "~/types/LocationNode";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}


function filterRouteNodes(nodes: LocationNode[]): LocationNode[] {
    return nodes.filter(node => (node.tags ?? []).includes("route"));
}


export default function View() {
    const [nodes, setNodes] = useState<LocationNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Index of the node currently displayed (starts at 0 once data loads)
    const [currentIdx, setCurrentIdx] = useState<number>(0);



    useEffect(() => {
        async function loadNodes() {
            try {
                const fetched = await mapAPI.getAllNodes();
                const routeOnly = filterRouteNodes(fetched.data);
                
                // OPTIONAL: ensure deterministic order (e.g., by id)
                const ordered = routeOnly;
                setNodes(ordered);
                setCurrentIdx(0); // reset to first node after load
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        }

        loadNodes();
    }, []);



    const { currentNode, prevNode, nextNode } = useMemo(() => {
        const cur = nodes[currentIdx] ?? null;
        const prev = currentIdx > 0 ? nodes[currentIdx - 1] : null;
        const next = currentIdx < nodes.length - 1 ? nodes[currentIdx + 1] : null;
        return { currentNode: cur, prevNode: prev, nextNode: next };
    }, [nodes, currentIdx]);


    const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));
    const goNext = () => setCurrentIdx((i) => Math.min(i + 1, nodes.length - 1));

    if (loading) {
        return <div className="p-4">Loading nodes…</div>;
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                Error loading nodes: {error}
            </div>
        );
    }

    // Guard against an empty list (shouldn’t happen, but be safe)
    if (!currentNode) {
        return <div className="p-4">No nodes available.</div>;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {/* ------------------- Header / Current node name ------------------- */}
            <h2 className="text-2xl font-bold mb-4">{currentNode.name}</h2>

            {/* ------------------- Navigation buttons ------------------- */}
            <div className="join grid grid-cols-2 gap-2 mb-6">
                <button
                    className="join-item btn btn-outline"
                    onClick={goPrev}
                    disabled={!prevNode}               // disables when there is no previous
                >
                    ← {prevNode?.name ?? "Previous"}
                </button>

                <button
                    className="join-item btn btn-outline"
                    onClick={goNext}
                    disabled={!nextNode}               // disables when there is no next
                >
                    {nextNode?.name ?? "Next"} →
                </button>
            </div>

            {/* ------------------- Optional: show extra info ------------------- */}
            <section className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Details</h3>
                <pre className="whitespace-pre-wrap">
                    {JSON.stringify(currentNode, null, 2)}
                </pre>
            </section>
        </div>
    );
}