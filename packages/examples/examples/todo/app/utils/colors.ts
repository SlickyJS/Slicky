export enum ColorBrightnessType
{
	Light,
	Dark,
}


export class Colors
{


	public static hexToRGB(color: string): {r: number, g: number, b: number}
	{
		let parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

		if (!parts) {
			throw new Error('Can not convert color "' + color + '" to RGB.');
		}

		return {
			r: parseInt(parts[1], 16),
			g: parseInt(parts[2], 16),
			b: parseInt(parts[3], 16),
		};
	}


	public static getBrightnessType(color: string): ColorBrightnessType
	{
		let rgb = Colors.hexToRGB(color);
		let yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;

		return (yiq >= 128) ? ColorBrightnessType.Light : ColorBrightnessType.Dark;
	}

}
