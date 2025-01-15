import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
	try {
		console.log("Fetching USD rate from dolaronline.cl");
		const response = await fetch("https://www.dolaronline.cl/");
		const html = await response.text();
		console.log("HTML content length:", html.length);

		const $ = cheerio.load(html);
		const usdValue = $("#vlr-cambios div span:nth-child(4)").text();
		console.log("Raw USD value:", usdValue);
		console.log("USD value length:", usdValue.length);

		const cleanValue = usdValue
			? parseFloat(usdValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;
		console.log("Cleaned USD value:", cleanValue);

		return NextResponse.json({ rate: cleanValue });
	} catch (error: any) {
		console.error("Error fetching USD rate:", error);
		console.error("Error details:", {
			name: error.name,
			message: error.message,
			stack: error.stack,
		});
		return NextResponse.json({ rate: 0 }, { status: 200 });
	}
}
