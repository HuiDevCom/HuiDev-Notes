---
title: "Svelte 5：让状态像风一样自然流动"
description: "从符文开始，重新理解响应式界面的边界与自由。"
publishedAt: 2026-09-12
updatedAt: 2026-09-15
category: "代码魔法"
tags:
  - Svelte 5
  - Frontend
  - Reactivity
readingTime: "8 min"
coverTone: "sky"
coverMark: "S"
coverImage: "/images/post-svelte-runes.webp"
featured: true
draft: false
---

第一次看到 Svelte 5 的符文语法时，我并没有立刻觉得它更“简洁”。`$state`、`$derived`、`$effect` 像几枚突然被放到桌上的新零件，需要重新理解它们之间的关系。

真正写过一段时间之后，我才发现变化并不在字符多少，而在于：**状态终于不再受组件顶层的限制。**

## 响应式不应该依赖位置

过去，我们会通过特定的声明位置和语法告诉编译器：“这个变量需要响应式更新。”它很轻巧，但当逻辑需要被抽离到普通文件、工厂函数或可复用模块时，边界就出现了。

Svelte 5 把这件事说得更直接：需要响应式，就明确使用符文。

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  点击 {count} 次，得到 {doubled}
</button>
```

这段代码并不神奇。恰恰相反，它的价值是消除了神秘感：`count` 是状态，`doubled` 是派生值，事件改变状态，界面随之更新。

## `$state` 不是新的 store

把 `$state` 理解为 store 的替代品，会错过它最有趣的部分。它更像是一种可以跟随数据结构自然生长的响应式能力。

```ts
let note = $state({
  title: '风经过的地方',
  tags: ['Svelte', 'Design'],
  published: false,
});

note.published = true;
note.tags.push('Daily');
```

不需要反复复制对象，也不需要为了触发更新而设计额外的赋值动作。代码表达的是“修改这份数据”，而不是“向框架证明数据被修改了”。

当然，自由不等于随意。状态越容易共享，越要认真决定它的所有权。我的习惯是：

- 只在多个视图确实需要共同修改时抽离状态；
- 可以计算得到的值使用 `$derived`，不额外保存；
- `$effect` 只负责与外部世界同步，不承担普通业务计算；
- 让状态模块保持小而具体。

## 派生值应该像影子一样

好的派生值不需要被手动维护。它应该像物体的影子：光线变化时自然改变，而不是等待另一个人来重新描一遍。

```ts
let posts = $state<Post[]>([]);
let selectedTag = $state('全部');

let visiblePosts = $derived(
  selectedTag === '全部'
    ? posts
    : posts.filter((post) => post.tags.includes(selectedTag))
);
```

当 `posts` 或 `selectedTag` 改变，`visiblePosts` 始终保持正确。这里没有同步问题，也没有“忘记更新另一份状态”的机会。

## 我喜欢这种明确

Svelte 早期最迷人的地方，是它把复杂性藏得很好。Svelte 5 做的事情稍有不同：它没有把复杂性全部藏起来，而是给复杂性清楚地命名。

当一个应用很小，这种差异并不明显；当组件开始共享逻辑、状态跨越文件、交互逐渐变多，明确的边界就会变成一种温柔的保护。

> 好的响应式系统，不是让数据到处流动，而是让你随时知道风从哪里来，又要吹向哪里。

这也是我目前使用 Svelte 5 最大的感受：它依然轻盈，但不再依靠含蓄来保持轻盈。
