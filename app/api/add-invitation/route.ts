import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { name, mobile_number, regNum } = await req.json();

    // Validate required fields
    if (!name || !mobile_number || !regNum) {
      return NextResponse.json(
        { error: "Name, mobile number, and registration number are required" },
        { status: 400 },
      );
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobile_number)) {
      return NextResponse.json(
        { error: "Mobile number must be 10 digits" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const collection = db.collection("meḥfil-e-yash-invitations");

    // Check if registration number already exists
    const existingRegNum = await collection.findOne({ regNum });
    if (existingRegNum) {
      return NextResponse.json(
        {
          error:
            "Registration number already exists. Please use a unique number.",
        },
        { status: 400 },
      );
    }

    // Create new invitation document
    const newInvitation = {
      name: name.trim(),
      mobile_number: mobile_number.trim(),
      regNum: regNum.trim().toUpperCase(),
      created_at: new Date(),
    };

    const result = await collection.insertOne(newInvitation);

    return NextResponse.json({
      success: true,
      message: "Invitation added successfully",
      id: result.insertedId,
    });
  } catch (error: any) {
    console.error("Add invitation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add invitation" },
      { status: 500 },
    );
  }
}
