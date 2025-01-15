import { chromium } from "playwright";
import { NextResponse } from "next/server";

export async function GET() {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	try {
		await page.goto("https://www.dolaronline.cl/");
		const usdValue = await page
			.locator('//*[@id="vlr-cambios"]/div/span[4]')
			.textContent();

		console.log("Valor crudo: " + usdValue);
		const cleanValue = usdValue
			? parseFloat(usdValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;

		console.log("Valor limpio: " + cleanValue);
		await browser.close();
		return NextResponse.json({ rate: cleanValue });
	} catch (error) {
		console.error("Error fetching USD rate:", error);
		await browser.close();
		return NextResponse.json({ rate: 0 });
	}
}
