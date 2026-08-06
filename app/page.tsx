"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, Users, User, PlusCircle } from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a name or mobile number");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);
    setSearched(false);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: searchTerm.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results || []);
        setSearched(true);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSingle = (qrCode: string, name: string) => {
    router.push(`/generate?code=${qrCode}&name=${encodeURIComponent(name)}`);
  };

  const handleGenerateMultiple = () => {
    if (searchResults.length > 0) {
      const codes = searchResults.map((r) => r.qr_code).join(",");
      const names = searchResults.map((r) => r.name).join("|");
      const mobiles = searchResults.map((r) => r.mobile_number).join(",");

      router.push(
        `/generate-multiple?codes=${codes}&names=${encodeURIComponent(names)}&mobiles=${mobiles}`,
      );
    }
  };

  const handleAddNewInvitation = () => {
    router.push("/add-invitation");
  };

  const isMobileSearch = /^\d{10}$/.test(searchTerm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto pt-8 sm:pt-12 md:pt-16 lg:pt-20">
        {/* Header with Add Button */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex justify-end mb-3 sm:mb-4">
            <Button
              onClick={handleAddNewInvitation}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-cinzel text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6"
            >
              <PlusCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Add New Invitation</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#504943] mb-2 sm:mb-3 md:mb-4 font-arabic">
            <span className="font-arabic text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Meḥfil-e-Yash
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-arabic">
            Generate your personalized flyer
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="p-4 sm:p-6 md:p-8">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center text-[#504943] font-cinzel font-semibold">
              Search by Name or Mobile Number
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              Enter your full name or 10-digit mobile number
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Your Name or 1234567890"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-11 sm:h-12 md:h-14 text-base sm:text-lg border-2 border-amber-200 focus:border-amber-400"
                  required
                />
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 md:h-14 text-base sm:text-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 font-cinzel"
                disabled={loading || !searchTerm.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Search Results */}
            {searched && searchResults.length > 0 && (
              <div className="mt-6 sm:mt-8">
                {isMobileSearch && searchResults.length > 1 ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                          <h3 className="font-semibold text-[#504943] flex items-center text-sm sm:text-base">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-600" />
                            Found {searchResults.length} family members
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            This mobile number is associated with{" "}
                            {searchResults.length} people
                          </p>
                        </div>
                        <Button
                          onClick={handleGenerateMultiple}
                          className="bg-gradient-to-r from-amber-600 to-red-600 w-full sm:w-auto text-sm sm:text-base"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Generate All ({searchResults.length})
                        </Button>
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                      Individual Members:
                    </h4>
                    <div className="space-y-3">
                      {searchResults.map((result, index) => (
                        <Card
                          key={index}
                          className="p-3 sm:p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                              <h4 className="font-semibold text-[#504943] font-cinzel text-base sm:text-lg">
                                {result.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Mobile: {result.mobile_number}
                              </p>
                              <p className="text-xs text-gray-400">
                                Code: {result.qr_code}
                              </p>
                            </div>
                            <Button
                              onClick={() =>
                                handleGenerateSingle(
                                  result.qr_code,
                                  result.name,
                                )
                              }
                              variant="outline"
                              className="border-amber-500 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                            >
                              <User className="mr-2 h-4 w-4" />
                              Generate
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <Card
                        key={index}
                        className="p-4 sm:p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div>
                            <h4 className="font-semibold text-[#504943] font-arabic text-2xl sm:text-3xl md:text-4xl">
                              {result.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Mobile: {result.mobile_number}
                            </p>
                            <p className="text-xs text-gray-400">
                              Code: {result.qr_code}
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              handleGenerateSingle(result.qr_code, result.name)
                            }
                            className="bg-gradient-to-r from-amber-600 to-red-600 h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto text-sm sm:text-base"
                          >
                            Generate Flyer
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {searched && searchResults.length === 0 && !error && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No records found for "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-4 sm:mt-6 text-center">
          <Button
            variant="link"
            onClick={handleAddNewInvitation}
            className="text-amber-600 hover:text-amber-800 font-cinzel text-sm sm:text-base"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Need to add a new invitation? Click here
          </Button>
        </div>

        {/* Decorative Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 font-cinzel text-xs sm:text-sm">
          Meḥfil-e-Yash Invitation Generator © 2026
        </div>
      </div>
    </div>
  );
}
