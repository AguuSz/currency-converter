"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getARSRate, getUSDRate, getARSTarjetaRate } from "@/services/currency";
import { formatCurrency } from "@/utils/formatters";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CurrencyConverter() {
	const [clpNumeric, setClpNumeric] = useState<string>("");
	const [clpFormatted, setClpFormatted] = useState<string>("");
	const [usd, setUsd] = useState<number>(0);
	const [ars, setArs] = useState<number>(0);
	const [arsRate, setArsRate] = useState<number>(0);
	const [usdRate, setUsdRate] = useState<number>(0);
	const [lastUpdate, setLastUpdate] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [arsTarjeta, setArsTarjeta] = useState<number>(0);
	const [arsTarjetaRate, setArsTarjetaRate] = useState<number>(0);

	const handleClpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/[^\d]/g, ""); // Solo permitir números
		setClpNumeric(rawValue);

		// Solo formatear si hay un valor y no termina en cero
		if (rawValue) {
			const numValue = parseInt(rawValue, 10);
			setClpFormatted(formatCurrency(numValue));
		} else {
			setClpFormatted("");
		}
	};

	useEffect(() => {
		Promise.all([
			getARSRate().then(({ rate, timestamp }) => {
				setArsRate(rate);
				setLastUpdate(timestamp);
			}),
			getUSDRate().then((rate) => setUsdRate(rate)),
			getARSTarjetaRate().then((rate) => setArsTarjetaRate(rate)),
		]).then(() => {
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		const clpValue = Number(clpNumeric) || 0;
		const usdValue = clpValue / usdRate;
		const arsValue = usdValue * arsRate;
		const arsTarjetaValue = usdValue * arsTarjetaRate;

		setUsd(usdValue);
		setArs(arsValue);
		setArsTarjeta(arsTarjetaValue);
	}, [clpNumeric, arsRate, usdRate, arsTarjetaRate]);

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-lg sm:text-xl">
					Conversor de 🇨🇱 a dolares y 🇦🇷
				</CardTitle>
				<ThemeToggle />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="clp">Valor en CLP</Label>
					<Input
						id="clp"
						type="text"
						inputMode="numeric"
						placeholder="Ingrese el valor en CLP"
						value={clpFormatted}
						onChange={handleClpChange}
						disabled={isLoading}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="usd">Valor en USD</Label>
					<Input
						id="usd"
						type="text"
						value={
							isLoading
								? "Obteniendo información de tipo de cambio..."
								: formatCurrency(usd)
						}
						disabled
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="ars">Valor en ARS (pagando con dolar MEP)</Label>
					<Input
						id="ars"
						type="text"
						value={
							isLoading
								? "Obteniendo información de tipo de cambio..."
								: formatCurrency(ars)
						}
						disabled
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="ars-tarjeta">
						Valor en ARS (pagando con dolar tarjeta)
					</Label>
					<Input
						id="ars-tarjeta"
						type="text"
						value={
							isLoading
								? "Obteniendo información de tipo de cambio..."
								: formatCurrency(arsTarjeta)
						}
						disabled
					/>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
				{lastUpdate && (
					<p className="text-xs sm:text-sm">
						Última actualización:{" "}
						{new Date(lastUpdate).toLocaleTimeString("es-CL")}
					</p>
				)}
				<p className="text-xs text-justify">
					Esta calculadora funciona a modo aproximado. Eso quiere decir que
					puede haber ligeras variaciones dependiendo del valor del dolar que
					tome el banco, pero para referencia, se está tomando el valor del
					dolar MEP para ARS y el valor de venta del dolar oficial de Chile.
				</p>
			</CardFooter>
		</Card>
	);
}
