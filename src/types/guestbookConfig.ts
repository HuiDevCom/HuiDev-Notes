/**
 * 留言页配置类型。
 *
 * 留言数据由评论系统托管（见 commentConfig，当前为 Twikoo），
 * 本配置只控制留言页自身的可见性。
 */
export interface GuestbookConfig {
	/** 页面总开关：false 时导航入口同步隐藏，访问 /guestbook/ 跳转 404 */
	enable: boolean;
}
