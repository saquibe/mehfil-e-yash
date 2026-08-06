"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Download, Home } from "lucide-react";
import QRCode from "qrcode";

export default function GenerateFlyerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");
  const [name, setName] = useState("");
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [qrImage, setQrImage] = useState<string>("");
  const [compositeImage, setCompositeImage] = useState<string>("");
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    try {
      const fontWithSpace = new FontFace(
        "Syamsiah Arabic",
        "url(/fonts/Syamsiah-Arabic.woff2)",
        { weight: "100 900", style: "normal" },
      );
      await fontWithSpace.load();
      document.fonts.add(fontWithSpace);

      const fontWithoutSpace = new FontFace(
        "SyamsiahArabic",
        "url(/fonts/Syamsiah-Arabic.woff2)",
        { weight: "100 900", style: "normal" },
      );
      await fontWithoutSpace.load();
      document.fonts.add(fontWithoutSpace);

      // console.log("✅ Both fonts loaded successfully");
      setFontLoaded(true);
      return true;
    } catch (error) {
      console.error("❌ Font loading failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const code = searchParams.get("code");
      const personName = searchParams.get("name");

      if (!code || !personName) {
        router.push("/");
        return;
      }

      setQrCodeData(code);
      setName(decodeURIComponent(personName));

      await loadFont();
      await document.fonts.ready;
      await document.fonts.load('bold 50px "Cinzel"');

      await Promise.all([loadFrameImage(), generateQRCode(code)]);
      setLoading(false);
    };

    init();
  }, [searchParams, router]);

  const loadFrameImage = (): Promise<void> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = "/frame1.jpeg";
      img.onload = () => {
        setFrameImage(img);
        resolve();
      };
      img.onerror = () => {
        console.error("Failed to load frame image");
        resolve();
      };
    });
  };

  const generateQRCode = async (data: string): Promise<void> => {
    try {
      const qrDataURL = await QRCode.toDataURL(data, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrImage(qrDataURL);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  };

  useEffect(() => {
    if (!loading && frameImage && qrImage && canvasRef.current && fontLoaded) {
      createCompositeImage();
    }
  }, [loading, frameImage, qrImage, fontLoaded]);

  // Helper function to render text using HTML and capture to canvas
  const renderTextToCanvas = (
    text: string,
    fontFamily: string,
    fontSize: number,
    color: string,
  ): Promise<string> => {
    return new Promise((resolve) => {
      // Create a temporary div to render the text with HTML/CSS
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        font-family: "${fontFamily}", "Cinzel", serif;
        font-weight: 700;
        font-size: ${fontSize}px;
        color: ${color};
        white-space: nowrap;
        padding: 10px;
        background: transparent;
        letter-spacing: 0.5px;
      `;
      tempDiv.textContent = text.toUpperCase();
      document.body.appendChild(tempDiv);

      // Measure the text
      const rect = tempDiv.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Create a canvas to render the text
      const textCanvas = document.createElement("canvas");
      textCanvas.width = width + 20;
      textCanvas.height = height + 20;
      const textCtx = textCanvas.getContext("2d");

      if (textCtx) {
        // Draw the text using the same font
        textCtx.font = `700 ${fontSize}px "${fontFamily}", "Cinzel", serif`;
        textCtx.textAlign = "left";
        textCtx.textBaseline = "top";
        textCtx.fillStyle = color;
        textCtx.fillText(text.toUpperCase(), 10, 10);
      }

      // Clean up
      document.body.removeChild(tempDiv);

      resolve(textCanvas.toDataURL("image/png"));
    });
  };

  const createCompositeImage = async () => {
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = canvasRef.current;
    if (!canvas || !frameImage || !qrImage) return;

    canvas.width = frameImage.width;
    canvas.height = frameImage.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

    // Draw main name (centered at top) - Using Cinzel
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold 55px "Cinzel"`;
    ctx.fillStyle = "#A18268";
    const nameX = canvas.width / 2;
    const nameY = canvas.height * 0.525;
    ctx.fillText(name, nameX, nameY); // 🔴 Removed toUpperCase()

    // Load QR code
    const qrImg = new window.Image();
    qrImg.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
      qrImg.src = qrImage;
    });

    const qrSize = 500;
    const qrX = (canvas.width - qrSize) / 2 - 611;
    const qrY = canvas.height * 0.707;

    const padding = 15;
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 10;
    ctx.fillRect(
      qrX - padding,
      qrY - padding,
      qrSize + padding * 2,
      qrSize + padding * 2,
    );
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    ctx.save();
    const radius = 16;
    const x = qrX - padding;
    const y = qrY - padding;
    const w = qrSize + padding * 2;
    const h = qrSize + padding * 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    ctx.restore();

    // ===== DRAW NAME ON RIGHT SIDE OF QR =====
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.font = `bold 140px "Syamsiah Arabic", "Cinzel", serif`;
    ctx.fillStyle = "#66442F";
    const labelX = qrX + qrSize + 120;
    const labelY = qrY + qrSize / 2;

    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 10;
    ctx.fillText(name, labelX, labelY);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    await new Promise((resolve) => setTimeout(resolve, 200));

    // console.log("✅ Text drawn with font:", ctx.font);

    const dataUrl = canvas.toDataURL("image/png");
    setCompositeImage(dataUrl);
  };

  const handleDownload = () => {
    if (!compositeImage) return;

    const link = document.createElement("a");
    link.download = `mehfil-tash-${name.replace(/\s+/g, "_")}-${qrCodeData}.png`;
    link.href = compositeImage;
    link.click();
  };

  const handlePrint = () => {
    if (!compositeImage) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Meḥfil-e-Yash - ${name}</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: white;
              }
              img {
                max-width: 100%;
                height: auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              @media print {
                body { background: white; }
                img { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <img src="${compositeImage}" />
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600 font-cinzel">Creating your flyer...</p>
          <p className="text-xs text-gray-400 mt-2">
            {fontLoaded ? "✅ Font Loaded" : "⏳ Loading Font..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>

          <Button variant="ghost" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>

        <Card className="p-6 md:p-8 bg-white/95 backdrop-blur shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#504943] mb-2 font-arabic">
              Meḥfil-e-Yash
            </h2>
            <p className="text-gray-500 font-arabic text-2xl md:text-3xl lg:text-4xl">
              {name}
            </p>
          </div>

          {compositeImage && (
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-xl shadow-2xl overflow-hidden max-w-2xl">
                <img
                  src={compositeImage}
                  alt={`Meḥfil-e-Yash invitation for ${name}`}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 h-12 px-8 text-lg font-cinzel"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Flyer
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="h-12 px-8 text-lg border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-cinzel"
            >
              🖨️ Print Flyer
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500 bg-amber-50 inline-block px-4 py-2 rounded-full">
              <span className="font-semibold">QR Code contains:</span>{" "}
              {qrCodeData}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
