<p align="center">
  <img src="docs/assets/tashan.svg" alt="他山 Logo" width="200" />
</p>

<p align="center">
  <strong>数字世界公理体系</strong><br>
  <em>Axiomatic Framework for Human-Agent Digital Worlds</em>
</p>

<p align="center">
  <a href="#项目简介">简介</a> •
  <a href="#核心内容">核心内容</a> •
  <a href="#生态位置">生态位置</a> •
  <a href="#贡献">贡献</a> •
  <a href="README.en.md">English</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![状态](https://img.shields.io/badge/状态-待开始-lightgrey)

> 🔲 **本仓库当前为骨架仓库，等待正式开发启动。**

---

## 项目简介

### 在大框架中的位置

「人—智能体混合数字世界」研究的核心主张是：必须先构造一个可公理化、可实现、可验证的**世界底座**，才能谈论真人如何进入该世界。

本项目对应世界底座的**第一层：公理体系（T–PA–G 三层）**。  
它的任务不是给出某套具体实现，而是定义：任意一个人—智能体混合数字世界若要成立，**本质上必须满足什么条件**。

没有本层，②体系结构就没有理论依据；没有①和②，③沙盘验证就没有基准。

### 核心设计

三层结构——本质目标（T）→ 抽象公理（PA）→ 当前系统要求（G）——保证了：

- **T 层与 PA 层**：与具体实现无关，可跨版本、跨系统复用
- **G 层**：绑定当前实现，允许随系统演化更新
- **三种语境**：同一体系可在数学（状态空间、演化算子）、物理（开放耦合动力系统）、计算机（安全性、活性、写边界合法性）三种语境中被理解

### 目标读者

- 研究者：希望为多智能体系统建立形式化理论基础
- 工程师：需要为数字世界选型或参考公理框架
- 系统设计者：理解"世界底座"的存在条件与分层逻辑

---

## 核心内容

> 📋 以下为规划内容，随开发进展持续填充。

- `T层/`：本质目标文档（可定义性、合法性、持续演化、开放演化、有效耦合）
- `PA层/`：抽象公理文档（写边界合法、真源唯一、接口完备、持续再进入、效应有终局等）
- `G层/`：当前系统要求文档（与②体系结构绑定）
- `映射关系/`：T→PA→G 追溯矩阵
- `形式化/`：数学符号化定义（可选扩展）

---

## 生态位置

本项目是「人—智能体混合数字世界」体系的组成部分：

| 层级 | 项目 | 仓库 | 类型 | 状态 |
|------|------|------|------|:----:|
| 世界底座 | **① 公理体系** ← 本仓库 | [world-axiom-framework](https://github.com/TashanGKD/world-axiom-framework) | 开源 | 🔲 |
| 世界底座 | ② 体系结构 | [world-three-particle-impl](https://github.com/TashanGKD/world-three-particle-impl) | 开源 | 🔲 |
| 世界底座 | ③ 沙盘验证 | [world-sandbox-validation](https://github.com/TashanGKD/world-sandbox-validation) | 开源 | 🔲 |
| 数字分身 | ④ 0→1构建 | [digital-twin-bootstrap](https://github.com/TashanGKD/digital-twin-bootstrap) | 开源 | 🟡 |
| 数字分身 | ⑤ 1→100迭代 | [digital-twin-iteration](https://github.com/TashanGKD/digital-twin-iteration) | 开源 | 🔲 |
| 核心应用 | 数字世界应用 | TashanGKD/tashan-world（私有） | 私有 | 🔲 |
| 商业化 | 数字分身平台 | TashanGKD/tashan-twin-platform（私有） | 私有 | 🔲 |
| 公益 | 他山论坛 | [tashan-forum](https://github.com/TashanGKD/tashan-forum) | 开源公益 | 🔲 |

**直接依赖关系**：
- ② 体系结构必须满足本仓库定义的所有公理
- ③ 沙盘验证以本仓库的 T–PA–G 体系为唯一判定基准
- 本仓库变动会触发联动规则**场景 A**（通知②对齐）和**场景 B**（通知③重验）

---

## 贡献

欢迎贡献！详见 [CONTRIBUTING.md](CONTRIBUTING.md)（待建）。

---

## 更新日志

见 [CHANGELOG.md](CHANGELOG.md)（待建）。

---

## 许可证

MIT License. See [LICENSE](LICENSE) for details.
