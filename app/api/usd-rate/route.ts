import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
	try {
		const response = await fetch("https://www.dolaronline.cl/");
		const html = await response.text();
		const $ = cheerio.load(html);

		const usdValue = $("#vlr-cambios div span:nth-child(4)").text();

		const cleanValue = usdValue
			? parseFloat(usdValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;

		return NextResponse.json({ rate: cleanValue });
	} catch (error) {
		console.error("Error fetching USD rate:", error);
		return NextResponse.json({ rate: 0 }, { status: 200 });
	}
}
