import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
	try {
		const response = await fetch(
			"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSMEP"
		);
		const html = await response.text();
		const $ = cheerio.load(html);

		const arsValue = $(
			"#market-scrll-1 li a span:nth-child(4) div:nth-child(2)"
		).text();

		const cleanValue = arsValue
			? parseFloat(arsValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;

		return NextResponse.json({ rate: cleanValue });
	} catch (error) {
		console.error("Error fetching ARS rate:", error);
		return NextResponse.json({ rate: 0 });
	}
}
