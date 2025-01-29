"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("earnings");

  async function fetchUsers() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`
      );
      const filteredUsers = response.data.users.map((user) => ({
        userId: user.userId,
        username: user.username,
        earnings: user.earnings,
        questCount: user.questCount,
      }));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const sortedUsers = [...users].sort((a, b) => b[filter] - a[filter]);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-24 p-4 ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Leaderboard
        </CardTitle>
        <div className="flex justify-center space-x-2 mt-2">
          <Button onClick={() => setFilter("earnings")} variant="outline">
            Sort by Earnings
          </Button>
          <Button onClick={() => setFilter("questCount")} variant="outline">
            Sort by Quests
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Quests Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user, index) => (
                <TableRow key={index}>
                  <Link href={`/profile/${user.userId}`}>
                    <TableCell>{user.username}</TableCell>
                  </Link>

                  <TableCell>${user.earnings}</TableCell>
                  <TableCell>{user.questCount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
