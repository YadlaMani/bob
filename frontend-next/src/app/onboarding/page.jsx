"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { countries } from "@/consts/countries";
import axios from "axios";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
const OnboardingPage = () => {
  const [joinAs, setJoinAs] = useState("both");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [country, setCountry] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  async function functionfetchUserDetails() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    setUser(response.data);
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/onboarding`,
        { username: user[0].username, joinAs, tags, ageGroup, country },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      router.push("/");
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    functionfetchUserDetails();
  }, []);
  return (
    <div className="container mx-auto p-6 max-w-2xl mt-16">
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Welcome, {user[0].username}!
            </CardTitle>
            <CardDescription>
              Let's get you set up before you jump into the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>I want to join as:</Label>
                <RadioGroup defaultValue="both" onValueChange={setJoinAs}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contributor" id="contributor" />
                    <Label htmlFor="contributor">Contributor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organization" id="organization" />
                    <Label htmlFor="organization">Organization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Interests (Press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-sm py-1 px-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add your interests..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group (Optional)</Label>
                <Select onValueChange={setAgeGroup}>
                  <SelectTrigger id="age-group">
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={setCountry} required>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Complete Onboarding
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default OnboardingPage;
