import { expect, test } from "@playwright/test";

const MOMENT_COUNT = 1;

test.describe("动态页", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/moments/");
		await expect(page.locator(".moment-card")).toHaveCount(MOMENT_COUNT);
	});

	test("只展示风绘笔记的重构动态", async ({ page }) => {
		await expect(page.locator(".page-header__title")).toHaveText("动态");
		const moment = page.locator(".moment-card").first();
		await expect(moment.locator(".moment-card__author")).toHaveAttribute(
			"href",
			"/about/",
		);
		await expect(moment.locator(".moment-card__name")).toHaveText("风绘");
		await expect(moment.locator(".moment-card__author img")).toHaveAttribute(
			"src",
			"/avatar.png",
		);
		await expect(moment.locator("time.moment-card__time")).toHaveAttribute(
			"datetime",
			/2026-09-29/,
		);
		await expect(moment.locator(".moment-card__content")).toContainText(
			"今天重构了风绘笔记",
		);
		await expect(moment.locator(".moment-card__tag")).toHaveText([
			"#站点更新",
			"#开发笔记",
		]);
		await expect(page.locator(".moment-card__gallery")).toHaveCount(0);
		await expect(page.locator(".moment-section__count")).toHaveCount(0);
	});

	test("搜索与空态同步到 URL", async ({ page }) => {
		const search = page.locator(".moment-section__search input");
		await search.fill("重构");
		await expect(page.locator(".moment-card")).toHaveCount(1);
		await expect(page).toHaveURL(/[?&]q=/);
		expect(new URL(page.url()).searchParams.get("q")).toBe("重构");

		await search.fill("不存在的动态");
		await expect(page.locator(".moment-section__empty")).toContainText(
			"没有符合条件的动态",
		);
		await search.fill("");
		await expect(page.locator(".moment-card")).toHaveCount(MOMENT_COUNT);
	});

	test("标签筛选可再次点击取消", async ({ page }) => {
		await expect(
			page.locator(".moment-section__chips .m3-chip--filter"),
		).toHaveCount(2);
		const filter = page.getByRole("button", {
			name: "站点更新",
			exact: true,
		});
		await filter.click();
		await expect(filter).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator(".moment-card")).toHaveCount(1);
		expect(new URL(page.url()).searchParams.get("tag")).toBe("站点更新");
		await filter.click();
		await expect(filter).toHaveAttribute("aria-pressed", "false");
		await expect(page.locator(".moment-card")).toHaveCount(MOMENT_COUNT);
	});
});
