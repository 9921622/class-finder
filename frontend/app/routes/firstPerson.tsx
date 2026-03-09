import React, { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { useParams, useNavigate } from "react-router";

import { mapAPI } from "~/APIWrapper";

import type { LocationNode } from "~/types/LocationNode";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Path View" },
        { name: "description", content: "Check route path" },
    ];
}

function filterRouteNodes(nodes: LocationNode[]): LocationNode[] {
    return nodes.filter(node => (node.tags ?? []).includes("route"));
}

export default function View() {
    const navigate = useNavigate();
    const params = useParams();
    
    // Get nodeIndex from URL params
    const nodeIndexFromUrl = params.nodeIndex ? parseInt(params.nodeIndex, 10) : 0;
    
    const [nodes, setNodes] = useState<LocationNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Index of the node currently displayed - initialize from URL parameter
    const [currentIdx, setCurrentIdx] = useState<number>(nodeIndexFromUrl);

    useEffect(() => {
        async function loadNodes() {
            try {
                // const { data: fetched } = await mapAPI.queryNodes({tags: ["route"]});
                const { data: fetched } = await mapAPI.getAllNodes();
                const routeOnly = filterRouteNodes(fetched);

                // OPTIONAL: ensure deterministic order (e.g., by id)
                // const ordered = routeOnly;
                const ordered = fetched;
                setNodes(ordered);
                
                // Validate that the URL index is within bounds after loading
                if (nodeIndexFromUrl >= ordered.length) {
                    // If URL index is out of bounds, redirect to first item
                    navigate("/firstPerson/0", { replace: true });
                    setCurrentIdx(0);
                } else {
                    setCurrentIdx(nodeIndexFromUrl);
                }
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        }

        loadNodes();
    }, [nodeIndexFromUrl, navigate]); // Re-run when URL param changes

    const { currentNode, prevNode, nextNode } = useMemo(() => {
        const nodeMap = new Map<number, LocationNode>();
        nodes.forEach((n) => nodeMap.set(n.id, n));

        const cur = nodeMap.get(nodes[currentIdx]?.id) ?? null;
        const prev = cur?.prevId != null ? nodeMap.get(cur.prevId) ?? null : null;
        const next = cur?.nextId != null ? nodeMap.get(cur.nextId) ?? null : null;

        return { currentNode: cur, prevNode: prev, nextNode: next };
    }, [nodes, currentIdx]);

    // Update URL when currentIdx changes
    const goPrev = () => {
        if (prevNode) {
            const newIdx = nodes.findIndex(n => n.id === prevNode.id);
            setCurrentIdx(newIdx);
            navigate(`/firstPerson/${prevNode.id}`);
        }
    };

    const goNext = () => {
        if (nextNode) {
            const newIdx = nodes.findIndex(n => n.id === nextNode.id);
            setCurrentIdx(newIdx);
            navigate(`/firstPerson/${nextNode.id}`);
        }
    };

    const goExit = () => {
        navigate(
            "/mmap?map=ELW1F"
        );
      };
 

    // Handle direct URL changes (like typing in browser)
    useEffect(() => {
        setCurrentIdx(nodeIndexFromUrl);
    }, [nodeIndexFromUrl]);

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

    // Guard against an empty list
    if (nodes.length === 0) {
        return <div className="p-4">No nodes available.</div>;
    }

    // Guard against invalid index
    if (!currentNode) {
        return <div className="p-4">Invalid node index.</div>;
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
                    disabled={!prevNode}
                >
                    ← {prevNode?.name ?? "Previous"}
                </button>

                <button
                    className="join-item btn btn-outline"
                    onClick={goNext}
                    disabled={!nextNode}
                >
                    {nextNode?.name ?? "Next"} →               
                </button>
               <button
               className="btn btn-outline btn-error w-full"
               onClick={goExit}
               >
               Exit
               </button>
            </div>

            <section className="bg-black-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Details</h3>
                {currentNode.image ? (
                    <img
                        src={currentNode.image}
                        alt={currentNode.name}
                        className="max-w-full h-auto mb-5 rounded shadow-md"
                        onError={(e) => {
                            console.error('Image failed to load:', currentNode.image);
                            // e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <p className="text-gray-500 italic">No image available</p>
                )}
            </section>
            
            {/* Position indicator */}
            <div className="text-sm text-gray-500 mt-4 text-center">
                {currentIdx + 1} / {nodes.length}
            </div>
        </div>
    );
}