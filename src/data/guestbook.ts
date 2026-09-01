/**
 * 留言页内容数据。
 *
 * 留言本身由评论系统（commentConfig，当前为 Twikoo）托管在 /guestbook/ 路径下，
 * 此处仅维护展示给访客的留言引导语；数组留空则不渲染引导区块。
 */
export const guestbookGuidelines: string[] = [
	"请保持友善和尊重，共同维护良好的交流氛围",
	"欢迎分享想法，或对站点提出建议",
	"每一条留言我都会认真阅读并尽量回复",
];
