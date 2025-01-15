import { chromium } from "playwright-core";
import { NextResponse } from "next/server";

export async function GET() {
	let browser;
	try {
		browser = await chromium.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			headless: true,
		});
		const page = await browser.newPage();

		await page.goto("https://www.dolaronline.cl/", {
			waitUntil: "networkidle",
		});
		const usdValue = await page
			.locator('//*[@id="vlr-cambios"]/div/span[4]')
			.textContent();

		const cleanValue = usdValue
			? parseFloat(usdValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;

		await browser.close();
		return NextResponse.json({ rate: cleanValue });
	} catch (error) {
		console.error("Error fetching USD rate:", error);
		if (browser) await browser.close();
		return NextResponse.json({ rate: 0 }, { status: 200 });
	}
}
