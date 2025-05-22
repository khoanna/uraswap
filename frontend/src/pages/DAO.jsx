import { useEffect, useState } from "react";
import { useStateContext } from '../context';
import { formatEther } from "ethers";
import { Card, CardContent } from "../components";


function Button({ children, onClick, disabled, variant = "default", className = "" }) {
    const base = "px-4 py-2 rounded font-medium focus:outline-none transition";
    const styles = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {children}
        </button>
    );
}

export default function DAOVotePage() {
    const { address, hasVoted, getAllProposals, vote, isConnected } = useStateContext();
    const [proposals, setProposals] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userVotes, setUserVotes] = useState({});

    const fetchProposals = async () => {
        try {
            const result = await getAllProposals();
            const descriptions = result[0];
            const yesVotes = result[1];
            const noVotes = result[2];
            const starts = result[3];
            const ends = result[4];
            const executed = result[5];

            const data = await Promise.all(descriptions.map(async (desc, idx) => {
                const voted = await hasVoted(idx, address);
                return {
                    id: idx,
                    description: desc,
                    yes: Number(formatEther(yesVotes[idx].toString())).toFixed(0),
                    no: noVotes[idx].toString(),
                    start: Number(starts[idx]),
                    end: Number(ends[idx]),
                    executed: executed[idx],
                    hasVoted: voted,
                };
            }));

            const voteMap = {};
            data.forEach((d) => voteMap[d.id] = d.hasVoted);
            setUserVotes(voteMap);
            setProposals(data);

        } catch (error) {
            console.error("Failed to fetch proposals", error);
        }
    };

    const handleVote = async (proposalId, support) => {
        try {
            setLoading(true);
            await vote(proposalId, support);
            fetchProposals();
            setSelected(null);
        } catch (error) {
            console.error("Vote failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [address, isConnected]);

    return (
        <div className="p-6 min-h-screen">
            <h3 className='font-bold text-4xl text-center mb-4 text-gradient p-4'>Voting Dashboard</h3>
            {address ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proposals.map((p) => {
                            const isOpen = Date.now() / 1000 < p.end;
                            return (
                                <Card
                                    key={p.id}
                                    onClick={() => setSelected(p)}
                                    className={`cursor-pointer transition duration-200 hover:scale-105 ${isOpen ? "bg-white shadow-lg" : "bg-gray-200"}`}
                                >
                                    <CardContent>
                                        <p className="font-semibold text-xl">{p.description}</p>
                                        <p className="text-sm mt-2">Yes: {p.yes} | No: {p.no}</p>
                                        <p className="text-sm mt-2 text-gray-500">{isOpen ? "🟢 Voting Open" : "🔒 Closed"}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {selected && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-2xl">
                                <h2 className="text-xl font-bold mb-4">{selected.description}</h2>
                                <p className="mb-2">Yes votes: {selected.yes}</p>
                                <p className="mb-4">No votes: {selected.no}</p>
                                <div className="flex justify-between">
                                    <Button disabled={loading || userVotes[selected.id]} onClick={() => handleVote(selected.id, true)}>👍 Vote Yes</Button>
                                    <Button disabled={loading || userVotes[selected.id]} onClick={() => handleVote(selected.id, false)}>👎 Vote No</Button>
                                </div>
                                {userVotes[selected.id] && <p className="mt-2 text-sm text-green-600">You have already voted on this proposal.</p>}
                                <Button variant="ghost" className="mt-4 w-full" onClick={() => setSelected(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>) : (
                <div className="flex justify-center">
                    <w3m-button />
                </div>
            )}
        </div>
    );
}
