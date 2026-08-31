import { expect, test } from "@playwright/test";

/**
 * 风绘通行证页（passport）路由契约测试。
 * 当前站点配置 enable: true（凭据已配置）：面板渲染、导航出现「风绘通行证」
 * 下拉菜单（pageKey=passport，含通行证/个人资料二级项）。
 * 页面标识始终为 passport（个人资料页高亮走 passport-profile，见 nav-utils）。
 */
test.describe("通行证页", () => {
	test("直载：页面标识为 passport 且面板与导航入口渲染", async ({ page }) => {
		await page.goto("/passport/", { waitUntil: "domcontentloaded" });
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"passport",
		);
		await expect(page.locator(".passport-section").first()).toBeVisible();
		// 导航下拉：分组触发器 + 二级项都带 passport 标识
		await expect(
			page.locator('[data-nav-key="passport"]').first(),
		).toBeAttached();
	});

	test("Swup 站内导航后 data-current-page 同步为 passport 且导航入口点亮", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForFunction(() => Boolean(window.swup?.navigate));
		await page.evaluate(() => window.swup?.navigate("/passport/"));
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"passport",
		);
		await expect(page).toHaveURL(/\/passport\/$/);
		// Swup 替换后持久壳的导航高亮按 pageKey 重新点亮
		await expect(page.locator('[data-nav-key="passport"]').first()).toHaveClass(
			/active/,
		);
	});
});
