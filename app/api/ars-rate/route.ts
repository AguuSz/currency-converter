import { chromium } from "playwright-core";
import { NextResponse } from "next/server";

export async function GET() {
	const browser = await chromium.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();

	try {
		await page.goto(
			"https://www.cronista.com/MercadosOnline/moneda.html?id=ARSMEP"
		);
		const arsValue = await page
			.locator('//*[@id="market-scrll-1"]/li/a/span[4]/div[2]')
			.textContent();

		const cleanValue = arsValue
			? parseFloat(arsValue.replace("$", "").replace(".", "").replace(",", "."))
			: 0;

		await browser.close();
		return NextResponse.json({ rate: cleanValue });
	} catch (error) {
		console.error("Error fetching ARS rate:", error);
		await browser.close();
		return NextResponse.json({ rate: 0 });
	}
}
