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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { countries } from "@/consts/countries";
import { areas } from "@/consts/tags";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const OnboardingPage = () => {
  const [joinAs, setJoinAs] = useState("both");
  const [selectedTags, setSelectedTags] = useState([]);
  const [ageGroup, setAgeGroup] = useState("");
  const [country, setCountry] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function fetchUserDetails() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  }

  const handleAddTag = (area) => {
    if (selectedTags.length >= 6) {
      toast.error("You cannot select more than 6 interests.");
      return;
    }
    if (!selectedTags.includes(area)) {
      setSelectedTags([...selectedTags, area]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/onboarding`,
        { username: user[0].username, joinAs, tags: selectedTags, ageGroup, country },
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
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchUserDetails();
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
                <label>I want to join as:</label>
                <RadioGroup defaultValue="both" onValueChange={setJoinAs}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contributor" id="contributor" />
                    <label htmlFor="contributor">Contributor</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organization" id="organization" />
                    <label htmlFor="organization">Organization</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <label htmlFor="both">Both</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Interest Selection */}
              <div className="space-y-2">
                <label htmlFor="areas">Select Interests (Max 6)</label>
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger id="areas">
                    <SelectValue placeholder="Choose an interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected Interests Display */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="space-y-2">
                <label htmlFor="age-group">Age Group (Optional)</label>
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

              {/* Country Selection */}
              <div className="space-y-2">
                <label htmlFor="country">Country</label>
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

              {/* Submit Button */}
              {isLoading ? (
                <Button type="submit" className="w-full">
                  Complete Onboarding
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled>
                  Loading...
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default OnboardingPage;
