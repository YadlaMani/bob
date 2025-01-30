"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"; // Import Badge component

export default function ForumsPage() {
  const [user, setUser] = useState(null);
  const [forums, setForums] = useState([]);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    description: "",
    bounty: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const wallet = useWallet();
  const { connection } = useConnection();

  // Redirect to login if no token is found
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.message("You need to login to use this feature");
      router.push("/login");
    }
  }, [router]);

  // Fetch forums from the backend
  async function fetchForums() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums`
      );
      setForums(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load forums");
    }
  }

  // Fetch user details
  async function fetchUser() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  }

  // Handle creating a new forum
  async function createForum() {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/forums`,
        newForum,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const lamports = Number.parseFloat(newForum.bounty) * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: process.env.NEXT_PUBLIC_MASTER_WALLET,
          lamports,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
      toast.success("Bounty set successfully!");
      toast.success("Forum created successfully!");
      setNewForum({ title: "", description: "", bounty: 0 });
      setIsCreateFormVisible(false);
      fetchForums();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create forum");
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchUser();
    fetchForums();
  }, []);

  // Filter forums based on search query
  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate open and closed forums
  const openForums = filteredForums.filter((forum) => forum.status === "open");
  const closedForums = filteredForums.filter(
    (forum) => forum.status === "closed"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forums</h1>
        <Button onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}>
          {isCreateFormVisible ? "Cancel" : "Create New Forum"}
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Create New Forum Form */}
      {isCreateFormVisible && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create a New Forum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newForum.title}
                  onChange={(e) =>
                    setNewForum({ ...newForum, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newForum.description}
                  onChange={(e) =>
                    setNewForum({ ...newForum, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bounty" className="text-right">
                  Bounty
                </Label>
                <Input
                  id="bounty"
                  type="number"
                  value={newForum.bounty}
                  onChange={(e) =>
                    setNewForum({ ...newForum, bounty: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
              <Button onClick={createForum} className="ml-auto">
                Create Forum
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Open Forums */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {openForums.length > 0 ? (
          openForums.map((forum) => (
            <Link href={`/forum/${forum._id}`} key={forum._id}>
              <Card key={forum._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {forum.title}
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      Open
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{forum.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Bounty: ${forum.bounty}</span>
                    <span>Comments: {forum.comments?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No open forums found.
          </p>
        )}
      </div>

      {/* Display Closed Forums */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Closed Forums</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {closedForums.length > 0 ? (
          closedForums.map((forum) => (
            <Link href={`/forum/${forum._id}`} key={forum._id}>
              <Card key={forum._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {forum.title}
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800"
                    >
                      Closed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{forum.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Bounty: ${forum.bounty}</span>
                    <span>Comments: {forum.comments?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No closed forums found.
          </p>
        )}
      </div>
    </div>
  );
}
