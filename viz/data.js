/**
 * 三层目标—公理—要求体系 v2.2 图数据（扩充版）
 * 来源：三层目标—公理—要求体系_v2.2.md + 三层体系元逻辑说明书_v2.md
 */
const TPAG_DATA = {

  /* ───────────────────────────── T 层节点 ───────────────────────────── */
  nodes: {
    T: [
      {
        id: 'T1', label: 'T1 可定义性',
        short: '系统必须能被形式化描述',
        desc: '系统必须能被形式化描述。最小要求：（1）可区分的主体与环境；（2）可描述的状态；（3）可描述的演化；（4）可描述的相互作用。\n\n违反后果：根本得不到一个系统（不是"跑得不好"，而是"连系统都不存在"）。',
        violation: '案例：一个"多智能体协作系统"用自然语言定义"A负责写代码、B负责审查、C负责测试"，但未定义 agent 是什么、状态是什么、消息如何路由、动作如何影响世界。试图推演"A完成代码后通知B"时，无法回答：通知从哪里来？经过什么路径？B何时收到？B的状态如何变化？整个推演从起点就失去基础，无法进行。',
        analogies: [
          { domain: '物理', text: '必须首先定义相空间（主体/环境可区分状态）才能建立力学体系' },
          { domain: '计算机', text: '必须首先定义进程（主体）、内存（环境）、系统调用（接口）、调度器（演化）' },
          { domain: '芯片', text: '必须首先定义寄存器（状态）、ISA（演化规则）、总线（相互作用）' }
        ]
      },
      {
        id: 'T2', label: 'T2 合法性',
        short: '任意时刻处于合法状态域',
        desc: '系统在任意时刻都必须处于合法状态域中。最小要求：状态值域合法、写边界合法、时间单调、真源唯一、接口完备。\n\n三维写合法性：\n· 值域约束：写的【结果】在合法范围内（如 energy∈[0,100]）\n· 写权唯一：写的【主体】唯一（不能多个组件直接修改同一状态）\n· 写边界：写的【影响范围】有界（一次写操作不应越权影响无关状态分量）\n\n违反后果：系统进入非法状态，后续演化结果不可信。',
        violation: '案例：Agent B 具有直接修改 Agent A 的 energy 字段的权限（违反写权唯一）。B 在某轮演化中将 A 的 energy 从 20 直接设为 150（超出 [0,100] 合法域）。此后 3 小时内，所有依赖 A 的 energy 的判断（"A 是否需要休息？"、"A 的输出带宽是多少？"、"P0 是否触发？"）都建立在这个非法值之上，产生完全不可预期的行为。这不是"A 的行为有点怪"，而是"A 的所有行为从此失去语义基础"。',
        analogies: [
          { domain: '物理', text: '守恒律（能量守恒、动量守恒）——合法状态域是满足守恒律的状态集合' },
          { domain: '计算机', text: '内存安全——进程越界写入其他进程内存，B 的所有状态都不可信' },
          { domain: '芯片', text: '总线仲裁——多设备同时争写，数据总线信号叠加为噪声，所有读取都无意义' }
        ]
      },
      {
        id: 'T3', label: 'T3 持续演化',
        short: '理想条件下持续无限时间演化',
        desc: '系统必须能在理想条件下持续无限时间演化，不因内部机制缺陷在有限时间内耗尽、沉默、堵塞或爆炸。\n\n最小要求四个方向：\n· 资源不会只耗不补（PA3 可恢复性）\n· 累积不会只增不减（PA2 有界性）\n· 调度不会中断（PA4 持续再进入）\n· 演化函数无死状态（PA1 全函数）\n\n违反后果：永久沉默、资源耗尽停机、内部积压溢出、有限时间终止。',
        violation: '案例：Agent B 的 energy 以 -3/h 的速度消耗（工作状态），理论上存在 recovering 活动（+5/h）。但 B 所在的任务场是 mission_locked，P0 规则在 energy=0 时触发，试图切换到 recovering 活动。然而 recovering 意味着退出当前场，而 mission_locked 的 normative_force=binding 约束阻止了这一操作。energy 永远无法回升，B 从此永久沉默。恢复路径"理论存在"但"实际不可达"——PA3 被违反。',
        analogies: [
          { domain: '物理', text: '非平衡定态——系统持续耗散但靠外部输入维持，不趋向热寂' },
          { domain: '计算机', text: '垃圾回收机制 + 调度器——无 GC 则 OOM；无调度则饥饿' },
          { domain: '芯片', text: '时钟信号 + 看门狗定时器——没有时钟电路停转；没有 watchdog 死锁后无法恢复' }
        ]
      },
      {
        id: 'T4', label: 'T4 开放演化',
        short: '避免收敛到吸收态或病态循环',
        desc: '系统不仅要能持续运行（T3），还要避免在非预期条件下收敛到吸收态、僵死态，或陷入无语义进展的病态循环。\n\nT3 vs T4 的区别：\n· T3 = 系统活着（不在有限时间内死亡）\n· T4 = 系统活得有意义（演化有语义进展，不空转、不僵死）\n\n一个系统可以满足 T3（一直在运行）但违反 T4（永远在几个无意义状态间循环）。\n\n"非预期/无意义"的判据：由系统设计层定义的进展投影 P(s) 来界定。',
        violation: '案例：Agent A 和 Agent B 处于义务循环死锁（A 等 B 完成义务 X，B 等 A 完成义务 Y，blocking_on 形成环）。两者的 next_wakeup 正常更新（T3 满足，PA4 满足），每 5 分钟各自演化一次。但每次演化后，A 发现 B 的义务 X 仍未完成，继续等待；B 同理。系统在这两个状态间机械来回，永无进展。没有 PA8 的语义进展公理，系统无法自主逃离这个循环。',
        analogies: [
          { domain: '物理', text: '系统陷入非目标极限环——粒子一直在动（T3），但永远无法到达目标区域' },
          { domain: '计算机', text: '活锁（livelock）——两个进程持续地相互礼让，都没有实质推进' },
          { domain: '芯片', text: '流水线气泡——时钟一直在转（T3），但大量 NOP 指令导致有效指令吞吐量趋近于零' }
        ]
      },
      {
        id: 'T5', label: 'T5 有效耦合',
        short: '主体真实受环境影响并影响环境',
        desc: '主体必须真实地受到环境影响，并真实地影响环境。系统不是若干自循环模块的并列，而是真正发生相互作用的多主体系统。\n\n最小要求：\n· 合法事件最终能影响相应主体（观察侧）\n· 合法动作最终能改变相应世界（行动侧）\n· 两者缺一不构成真实耦合\n\n违反后果：各自自循环的 agent 集合；名义上的多主体，而非真实相互作用系统。',
        violation: '案例：设计者将所有 agent 的 memory 设计为完全私有（每个 agent 有独立的 world 副本），没有共享的 InteractionContext。Agent A 在自己的 world 副本中"发布"了一条任务分配消息，但这条消息没有任何路由路径到达 Agent B 的 world 副本。B 永远不知道 A 的动作，A 的所有动作对 B 的状态零影响。两者各自独立演化，形式上都在运行（T3 满足），但根本不是在"协作"。',
        analogies: [
          { domain: '物理', text: '粒子—场相互作用（牛顿第三定律）——主体既受场影响，也反作用于场' },
          { domain: '计算机', text: '完整 I/O 系统——CPU 能读取输入（观察侧），也能向输出写入（行动侧）' },
          { domain: '芯片', text: '传感—控制回路——传感器读取环境（观察），执行器修改环境（行动），缺一则开环' }
        ]
      }
    ],

    /* ───────────────────────────── PA 层节点 ───────────────────────────── */
    PA: [
      {
        id: 'PA1', label: 'PA1 存在与可区分',
        short: '状态空间良定义，主体/环境可区分，演化全函数',
        tServices: ['T1', 'T5'],
        desc: '系统状态空间必须良定义，且至少能区分：（1）主体侧状态；（2）环境侧状态；（3）相互作用路径。演化算子必须是全定义函数，对任意合法状态都能给出下一步。\n\n服务的 T 目标：T1（可定义性）、T5（有效耦合）。\n若缺失：无法定义 agent、world、耦合；行为方向性无法定义；整个体系失去基础。',
        math: '∃ 状态空间 S:\n  S = S_agent ⊕ S_world ⊕ S_interaction\n  其中 S_agent ≠ ∅, S_world ≠ ∅\n\n∧ ∀ s ∈ S_legal, ∃ s\' ∈ S_legal: transition(s) → s\'\n  （演化算子对任意合法状态全定义）',
        violation: '案例：系统将 agent 的状态和 world 的状态混写在同一个 JSON 文件中，没有边界。两个 agent 同时修改这个文件，产生不可预期的合并。无法定义"哪条记录属于哪个 agent 的本体状态"。无法区分"谁在行动"和"谁被作用"。这是 PA1 违反。',
        analogies: [
          { domain: '物理', text: '相空间（phase space）的存在性 + 哈密顿演化算子的全定义性' },
          { domain: '计算机', text: '进程模型（kernel/user space 分离）+ 程序语义的完整性（任何合法输入都有输出）' },
          { domain: '芯片', text: 'ISA 完整定义 + 地址空间分区（内核/用户分离）' }
        ]
      },
      {
        id: 'PA2', label: 'PA2 有界性',
        short: '可能无界增长的状态量必须有上界或有界控制',
        tServices: ['T2', 'T3'],
        desc: '对系统中任何可能无界增长的状态量 X，都必须存在有限上界、有限表示或等价的有界控制机制。\n\nX 包括但不限于：\n· 资源类：energy、attention_budget、token_budget\n· 累积类：memory_size、notification_count、context_count、obligation_count\n\n服务的 T 目标：T2（合法性）、T3（持续演化）。\n若缺失：资源枯竭、内部积压爆炸、被历史拖死、有限时间内丧失演化能力。',
        math: '∀ X ∈ { 设计时识别为"可能无界增长"的状态量 }:\n  ∃ B_X ∈ ℝ⁺: ∀ t ≥ 0, |X(t)| ≤ B_X\n\n关键约束："可能无界增长"的识别发生在系统设计阶段，\n不要求运行时动态判定。',
        violation: '案例：某系统每次 agent 发消息都向所有其他 agent 发通知，且无 TTL。1000 轮后，50 个 agent 的系统中每个 agent 有约 50,000 条 pending 通知。assemble 时 context window 溢出，系统无法演化。PA2 违反导致 T3 失效。',
        analogies: [
          { domain: '物理', text: '有界 Lyapunov 函数（系统能量有上界）' },
          { domain: '计算机', text: '垃圾回收（防内存泄漏）+ 队列深度限制（背压机制）' },
          { domain: '芯片', text: 'FIFO 深度上界 + DDR 容量限制 + 缓冲区边界保护' }
        ]
      },
      {
        id: 'PA3', label: 'PA3 可恢复性',
        short: '关键资源存在从耗尽态可达的严格正恢复路径',
        tServices: ['T3'],
        desc: '任何可被消耗的关键资源，都必须存在从任意耗尽态可达的严格正恢复路径。\n\nPA2 与 PA3 互补：\n· PA2 要求有上界（不能无限增长）\n· PA3 要求有恢复路径（不能单调耗尽）\n· 合起来：资源处于 [R_min, B_R] 内的长时健康区间\n\n"可达"的关键含义：恢复路径必须在实际轨迹中可达，不能只在理论上存在。\n\n服务的 T 目标：T3（持续演化）。',
        math: '∀ R ∈ ConsumableResources（可被消耗的关键资源）:\n  ∀ s 满足 R(s) = R_min（资源耗尽态）:\n    ∃ path p: s →* s\', 且沿 p 有 ΔR > 0（严格正增量）\n    ∧ path p 在系统可达轨迹中存在（不只是理论存在）',
        violation: '案例：Agent B 所在场是 mission_locked，energy 以 -3/h 消耗，recovering 活动（+5/h）存在但需要退出场才能进入。energy 到 0 后，P0 规则触发但被 mission_locked 阻止。恢复路径"理论存在"但"实际不可达"，PA3 被违反。B 永久沉默。',
        analogies: [
          { domain: '物理', text: '热力学中的可逆抽运——从低能态可以通过抽运到高能态' },
          { domain: '计算机', text: '内存回收路径的存在 + 磁盘 I/O 请求的完成路径' },
          { domain: '芯片', text: '充电控制器（电池从耗尽态可充电）+ 电压恢复电路' }
        ]
      },
      {
        id: 'PA4', label: 'PA4 持续再进入',
        short: '有限时间内重新获得一次合法演化机会',
        tServices: ['T3', 'T5'],
        desc: '系统在任意可达状态下，都必须在有限时间内重新获得一次合法演化机会。该机会可来自时间驱动触发、外部事件触发、或内部调度触发（三者满足其一即可）。\n\nPA4 与 PA8 的精确区别：\n· PA4 不要求状态必须发生变化，不要求本轮产生语义进展\n· PA4 只要求：系统不能永久失去再次演化的机会\n· PA8 进一步要求：若长期无进展，必须有逃离机制\n\n服务的 T 目标：T3（持续演化）、T5（有效耦合）。',
        math: '∀ s ∈ S_reachable（任意可达状态）:\n  ∃ t\' > t_now, ∃ component C: scheduled_evolution(C, t\')\n  // 不要求 s 必须发生变化（静息合法）\n  // 只要求"有机会演化"不被永久失去\n\nPA4 满足：agent 合法休眠，next_wakeup=now+8h，时间到了会被唤醒\nPA4 违反：agent 的 next_wakeup=null，永远不会被唤醒',
        violation: '案例：三个 agent A、B、C 约定：A 等 B 回复后才设置 next_wakeup；B 等 C；C 等 A。初始时，三者的 next_wakeup 都是 null（等待对方）。没有时间驱动的备用触发。系统永久沉默。三方循环等待，没有任何一个会被再次调度。',
        analogies: [
          { domain: '物理', text: '庞加莱递归定理——有界系统轨迹无限多次回归' },
          { domain: '计算机', text: '事件循环永不停止 + 调度器总有下一个 tick' },
          { domain: '芯片', text: '时钟信号（clock）永不停止 + 看门狗定时器（watchdog）防止死锁' }
        ]
      },
      {
        id: 'PA5', label: 'PA5 写权唯一性',
        short: '每个 durable 状态分量有唯一直接写权限威者',
        tServices: ['T1', 'T2'],
        desc: '任意 durable 状态分量 sᵢ，必须有且仅有一个直接写权限威者（authoritative writer）。其他组件只能通过该权威者的 apply 路径间接影响 sᵢ，不能直接修改。\n\n"durable"在 PA 层的抽象含义：其变更具有因果可追溯性的状态分量（该分量的变化会影响系统未来演化轨道）——区别于临时计算缓存。\n\n服务的 T 目标：T1（可定义性）、T2（合法性）。\n若缺失：耦合边界消失；行为因果不可追踪；审计无法进行。',
        math: '∀ sᵢ ∈ S_durable（任意因果可追溯的状态分量）:\n  |{ C | can_directly_write(C, sᵢ) }| = 1\n  // 直接写权限者有且仅有一个\n\n∧ ∀ C\' ≠ authoritative_writer(sᵢ):\n    C\' 对 sᵢ 的影响必须通过:\n    C\' → emit(event) → route → authoritative_writer(sᵢ).apply(event)',
        violation: '案例：系统中，agent 的 active_key 既可以被 LLM 输出直接覆写，也可以被 ContextClosedEvent 处理逻辑自动重置。两者并发时竞争，结果取决于顺序，且无法追溯哪次写是"对的"。这是 PA5 违反——不是代码 bug，而是结构上的多写者设计。',
        analogies: [
          { domain: '物理', text: '哈密顿量的唯一性——系统演化由唯一的演化算子决定' },
          { domain: '计算机', text: 'Rust 的所有权系统（最多一个可变引用）+ 数据库的单主写入原则' },
          { domain: '芯片', text: '总线仲裁器（每个事务只有一个 master）+ 内存保护单元（MPU）' }
        ]
      },
      {
        id: 'PA6', label: 'PA6 效应有终局',
        short: '任何生成的 effect 须在有限时间内进入终态',
        tServices: ['T2', 'T3'],
        desc: '任何生成的 effect（效应）都必须在有限时间内进入终态（terminal state）。效应不得永久悬挂，不得无限次被重复激活。\n\n覆盖所有"挂起效应"：\n· Notification: consumed / expired / merged / archived\n· Request/ActionAttempt: accepted / rejected / failed / cancelled\n· Task/Obligation: satisfied / cancelled / expired\n· ContextClose/WorldEffect: applied / ignored / failed / archived\n\n服务的 T 目标：T2（合法性）、T3（持续演化）。',
        math: '∀ e ∈ Effects_generated（任意生成的效应对象）:\n  ∃ t_terminal ∈ (t_created, +∞):\n    status(e, t_terminal) ∈ TerminalStates(type(e))\n  // 必须在有限时间内进入终态\n  // 终态集合在设计时须显式定义',
        violation: '案例：一个"帮助请求"义务被创建后，提出者离开了该场景，义务没有超时机制、没有被显式取消，永远保持"active"状态。六个月后，系统中有 50,000 个永远活跃的义务。每次 agent 的 assemble 都要处理这些义务，系统崩溃。这是 PA6 违反。',
        analogies: [
          { domain: '物理', text: '激发态粒子的自发辐射——任何不稳定粒子最终衰变到稳定产物' },
          { domain: '计算机', text: 'RAII——资源生命周期有明确终点；GC finalization' },
          { domain: '芯片', text: '握手协议的完成（AXI 事务有 BVALID/BREADY 握手终结）' }
        ]
      },
      {
        id: 'PA7', label: 'PA7 信息可达性',
        short: '信息须在有限时间内到达有权接收的主体',
        tServices: ['T5'],
        desc: '任何有权接收特定信息的主体，该信息必须在有限时间内（且在信息有效期内）到达该主体。\n\nPA7 是 T5 有效耦合的"输入侧"保证：若信息永远到不了应该感知的主体，则"主体受环境影响"这件事就不成立。PA7 不要求信息立刻到达，但要求不能永远到不了。\n\nPA6 与 PA7 互补：PA6 防止"效应永久悬挂"；PA7 防止"信息永远到不了"。\n\n服务的 T 目标：T5（有效耦合）。',
        math: '∀ info i, ∀ agent aᵢ where authorized_recipient(aᵢ, i):\n  ∃ t_delivery ≤ t_expiry(i): received(aᵢ, i, t_delivery)\n\n注意：\n· 不要求"立刻到达"（可以有延迟）\n· 必须在信息有效期 t_expiry(i) 内到达\n· 对无有效期限制的信息：∃ t_delivery < +∞ 即可',
        violation: '案例：一个紧急通知（semantic_class = hazard）被发往 agent B，告知房间有烟雾警报。但系统的注意力门槛配置错误：hazard 类通知被 attention_policy 过滤（应强制通过）。B 永远收不到通知，继续在危险环境中"正常工作"。PA7 违反——合法接收者永远未收到信息，T5 的观察侧断裂。',
        analogies: [
          { domain: '物理', text: '电磁信号在有限时间内传播到接收者（光速有限，但一定到达）' },
          { domain: '计算机', text: '可靠消息传递（TCP 的 at-least-once + 超时）' },
          { domain: '芯片', text: '中断到达 CPU 的保证（IRQ 不被无限期屏蔽或丢失）' }
        ]
      },
      {
        id: 'PA8', label: 'PA8 语义进展',
        short: '定义 P(s) 进展投影，病态循环须有非零概率逃离',
        tServices: ['T4'],
        desc: '系统必须定义一个目标相关的进展投影 P(s)。若系统进入某个循环 C，且在该循环内 P(s) 没有净变化，则系统必须存在能逃离该循环的机制，且该机制不依赖人工干预。\n\n"目标相关"：P(s) 的定义来源于系统设计/配置层给定的维度（如任务完成状态、义务状态变化），而非运行时主观认定。\n\n为什么用 Prob[...] > 0 而非确定性逃离：PA8 不要求"一定逃离"（太强），只要求"逃离的概率非零"（系统不被吸收）。由于概率始终非零，随时间推移系统最终会逃离（Borel-Cantelli 引理的应用）。\n\n服务的 T 目标：T4（开放演化）。',
        math: '前提：系统设计者定义目标相关的进展投影函数\n∃ P: States → ProgressValue\n\n若 ∃ cycle C ⊆ reachable_trajectories,\n    ∀ s ∈ C: P(s) = P_constant（循环内 P 无净变化）\n则 ∃ escape_mechanism M:\n    Prob[system exits C via M] > 0  // 非零概率逃离\n  ∧ M 不依赖人工干预（自主触发）',
        violation: '案例：5 个 agent 在任务场持续对话：A "我在思考"，B "好的继续"，C "我同意"……循环 200 次，send_message 被频繁执行，事件日志充满消息记录。但没有 deliverable 被提交，没有 agenda 被更新，没有 obligation 被满足。last_progress_at（进展时间戳）从未更新。无 PA8 的系统中，这个循环永远持续，消耗无限计算资源，产出为零。',
        analogies: [
          { domain: '物理', text: '系统避免进入非目标吸引子（attractor）——不陷入不期望的极限环' },
          { domain: '计算机', text: '分布式系统的进展性质（progress property）+ 活锁检测与打破' },
          { domain: '芯片', text: '流水线向前推进（不只是有时钟，而是每个周期确实执行有意义的指令）+ 死锁检测' }
        ]
      },
      {
        id: 'PA9', label: 'PA9 观察—行动耦合',
        short: '主体既能观察环境又能通过行动产生净效果',
        tServices: ['T5', 'T1'],
        desc: '每个主体必须既能观察环境的相关状态（observation），又能通过行动对环境状态产生净效果（action）。二者均须成立，缺一不构成真实耦合。\n\nPA7 与 PA9 的精确分工：\n· PA7: info → agent（环境→主体，观察侧）\n· PA9: agent → world（主体→环境，行动侧）\n· T5 = PA7 ∧ PA9：双向真实耦合\n\n缺 PA7：主体是盲目执行器\n缺 PA9：主体是纯被动接收器\n\n服务的 T 目标：T5（有效耦合）、T1（可定义性）。',
        math: '∀ agent aᵢ ∈ Agents:\n  // 观察侧\n  ∃ ω_relevant ⊆ WorldState: aᵢ can_observe(ω_relevant)\n\n∧ // 行动侧\n  ∃ α ∈ Actions(aᵢ):\n    execute(aᵢ, α) → net_effect(WorldState) ≠ ∅\n    // "净效果"不为空：行动之后 WorldState 至少有一处实质性变化',
        violation: '案例：一个"观察者 agent"被配置为只有 read_messages 权限，没有任何写操作权限。该 agent 看到所有消息，"认知"到群聊进展，但无法发出任何有效行动。它自称系统"成员"，但实际对世界状态零影响。PA9 违反（行动侧退化），T5 失效。',
        analogies: [
          { domain: '物理', text: '牛顿第三定律——粒子既受场影响，也反作用于场' },
          { domain: '计算机', text: '完整 I/O 能力的进程（不只读，也能写）' },
          { domain: '芯片', text: '双向总线（bidirectional bus）——可发出请求，也可接受响应并产生结果' }
        ]
      }
    ],

    /* ───────────────────────────── G 层节点 ───────────────────────────── */
    G: [
      {
        id: 'G0', label: 'G0 存在性与本体结构',
        short: '粒子系统基本结构、状态空间、存储归属拓扑',
        paRoots: ['PA1', 'PA5'],
        tTargets: ['T1'],
        desc: '具体化 PA1（存在性与可区分）、PA5（写权唯一性）；服务 T1（可定义性）。\n\n核心内容：\n· 粒子三元组 P=(V_P, View_P, R_P)：V_P 本体变量、View_P 可见投影、R_P 演化规则\n· R_P 四子规则：assemble → evolve → emit → apply\n· 状态三层：S_global / S_durable / S_runtime_total\n· 存储归属：world/（V_A）、agents/（V_Bᵢ）、meta/（系统级）\n· 真源位置表（Source of Truth Table）',
        subReqs: [
          { id: 'G0-R001', level: '硬要求', title: '系统由粒子构成', desc: '至少一个世界粒子 A + 有限个智能体粒子 {B₁…Bₙ}，实现主体（Bᵢ）与环境（A）的基本区分。', pa: 'PA1' },
          { id: 'G0-R002', level: '硬要求', title: '粒子三元组 P=(V_P, View_P, R_P)', desc: 'V_P 是本体变量集；View_P 是对 V_P 的可见投影；R_P 是演化规则集。这是系统形式化描述的基本单元。', pa: 'PA1' },
          { id: 'G0-R003', level: '硬要求', title: 'R_P 四子规则', desc: 'R_P 必须细分为：assemble（组装输入上下文）/ evolve（计算输出）/ emit（转化为事件序列）/ apply（写回 V_P）。', pa: 'PA1' },
          { id: 'G0-R005', level: '硬要求', title: '三层状态区分', desc: 'S_global（粒子本体 durable 真状态）/ S_durable（含 notification_buffer 和 M_meta^persist）/ S_runtime_total（含 Scheduler 运行态等非 durable 量）。', pa: 'PA1' },
          { id: 'G0-R008', level: '硬要求', title: '三类顶层归属', desc: '所有 durable 持有者映射为：world/（V_A）· agents/role_i/（V_Bᵢ）· meta/（跨粒子系统级对象）。', pa: 'PA5' },
          { id: 'G0-R012', level: '硬要求', title: 'Source of Truth Table', desc: '关键概念真源位置已钉死。例：FieldProfile → world/interaction_contexts/…/field；notification_buffer → meta/notification_buffer/*；Global Event Log → meta/（不能误写成 agent 私有文件）。', pa: 'PA5' }
        ]
      },
      {
        id: 'G1', label: 'G1 合法状态域',
        short: '写隔离、基线保护、能量有界、单前景、效应终局',
        paRoots: ['PA5', 'PA2', 'PA6'],
        tTargets: ['T2'],
        desc: '具体化 PA5（写权唯一性）、PA2（有界性）、PA6（效应有终局）；服务 T2（合法性）。这些性质在任意时刻、任意演化步骤后都必须成立，违反任何一条系统进入非法状态。',
        subReqs: [
          { id: 'G1-R001', level: '硬不变量', title: '写隔离原则', desc: '任何粒子不能直接写入另一粒子的 V_P。跨粒子影响只能通过"发射事件 → 目标方 apply → 目标方写回 V_P"的路径实现。', pa: 'PA5' },
          { id: 'G1-R005', level: '硬不变量', title: '基线不被场/活动污染', desc: 'baseline_attention_policy 是 agent 的绝对人格基线。场进入、活动切换均不得通过 apply 修改此字段，只有 LLM 通过 Output.control_delta 或用户显式操作才可修改。', pa: 'PA5' },
          { id: 'G1-R007', level: '硬不变量', title: 'energy ∈ [0, 100]', desc: '任意时刻 energy 必须在 [0, 100] 内。所有 energy 更新（系统物理规则 + LLM 提议的 llmAdjustment）之后必须执行 clamp。', pa: 'PA2' },
          { id: 'G1-R008', level: '硬不变量', title: '单前景场假设', desc: '在 v1 体系下，任意时刻只有一个栈顶前景场是生效前景。ForegroundStack 只增加返回路径，不改变"单前景"的语义。', pa: 'PA5' },
          { id: 'G1-R010', level: '硬不变量', title: '通知必须有终局', desc: '每条 Notification 必须最终进入：consumed / expired / merged / archived（或等价语义）。不允许存在无 TTL 的永久 pending 通知。', pa: 'PA6' },
          { id: 'G1-R012', level: '硬不变量', title: '唯一真源不变量', desc: 'Global Event Log 必须是 append-only 的规范真源。WritebackLedger 若存在，只能作为已提交事件的细粒度展开/加速层，不得取代 Event Log 的规范地位。', pa: 'PA5' }
        ]
      },
      {
        id: 'G2', label: 'G2 单步演化完备性',
        short: '四阶段 assemble→evolve→emit→apply 必须完整',
        paRoots: ['PA1', 'PA4', 'PA5'],
        tTargets: ['T3'],
        desc: '具体化 PA1（全函数演化）、PA4（持续再进入）、PA5（写权唯一）；服务 T3（持续演化）。每次粒子演化必须经过完整四阶段，任何跳过某阶段的实现都是非法的。',
        subReqs: [
          { id: 'G2-R001', level: '硬要求', title: '四阶段演化必须完整', desc: '每次粒子演化必须经过：assemble → evolve → emit → apply。任何跳过某阶段的实现都是非法的。', pa: 'PA1' },
          { id: 'G2-R004', level: '硬要求', title: 'emit 事件路由合法', desc: 'emit 必须把输出转化为事件序列，通过事件路由影响目标粒子。禁止通过 emit 直接跨粒子写状态（G1-R001 的行为层对应）。', pa: 'PA5' },
          { id: 'G2-R005', level: '硬要求', title: 'apply 写回合法状态', desc: 'R_A^apply 必须接收 agent 事件并更新 interaction_contexts；若动作声称"改变了世界"，则该改变必须落实为可观测 effect 或可审计写回，不能只停留在 agent 自述。', pa: 'PA5' },
          { id: 'G2-R005a', level: '硬要求', title: '动作端到端闭环', desc: '任何声称产生世界效果的动作，必须存在规范闭环：intent → emit → route → R_A^apply → WorldEffect → ActionReceipt（或等价失败回执）→ agent 可见结果。receipt 确认前不得把该动作记为"已成功"。', pa: 'PA9' },
          { id: 'G2-R006', level: '硬要求', title: '无死状态原则', desc: '演化函数对任意合法状态必须产生合法下一状态，不允许存在"合法状态但演化函数无定义"的情况。（工程层的 LLM 幻觉导致停滞由 G8 级 N-tick 超时处理。）', pa: 'PA1' },
          { id: 'G2-R007', level: '判准', title: '六问判准', desc: '任意一条演化规则，至少必须能回答：到达（事件如何到达粒子）/ 看见（粒子能看到什么）/ 中断（如何打断）/ 输出（粒子输出什么）/ 写回（输出如何写入状态）/ 再调度（下次何时演化）之一。', pa: 'PA4' }
        ]
      },
      {
        id: 'G3', label: 'G3 持续稳定性',
        short: '调度链不断、能量恢复、记忆/通知/context 有界',
        paRoots: ['PA2', 'PA3', 'PA4', 'PA6'],
        tTargets: ['T3'],
        desc: '具体化 PA2（有界性）、PA3（可恢复性）、PA4（持续再进入）、PA6（效应有终局）；服务 T3（持续演化）。这四条公理缺一则无法稳定保证长期演化。',
        subReqs: [
          { id: 'G3-R001', level: '硬要求', title: 'time-driven 调度必须存在', desc: '系统必须支持时间驱动调度。对最小无限演化，time-driven 触发链不能在任何时刻断裂。', pa: 'PA4' },
          { id: 'G3-R003', level: '硬要求', title: 'next_wakeup 永不为 null', desc: '任意时刻，任意 agent 的 next_wakeup 必须是有效时间戳，不得为 null。若本轮 LLM 输出未给出，系统必须按默认策略自动填入。这是调度链不断的关键不变量。', pa: 'PA4' },
          { id: 'G3-R004', level: '硬要求', title: '能量恢复路径必须存在', desc: '至少存在一种活动预设使 energy_profile=recovering（Δenergy > 0），且从任意 energy 耗尽态可达此预设。sleeping/resting 类活动必须产生正能量增益。', pa: 'PA3' },
          { id: 'G3-R006', level: '硬要求', title: 'memory 必须有界', desc: 'Memory Store 必须是有界的，必须支持压缩/遗忘/分层检索机制，确保 context window 不会因记忆无限增长而溢出。禁止全量注入（G3-R007 禁止项）。', pa: 'PA2' },
          { id: 'G3-R008', level: '硬要求', title: 'notification_buffer 必须有界', desc: 'notification_buffer 必须是有界的，必须有 TTL 清理机制，确保通知队列不无限积压。每条通知应支持 ttl_sec 字段，到期后自动迁移至 expired 状态。', pa: 'PA2' },
          { id: 'G3-R012', level: '判准', title: '最小无限演化必要条件集', desc: '系统若要无限时间演化，至少同时满足：(1) energy 有界且存在严格正恢复路径；(2) memory 有界且有遗忘机制；(3) 每条通知必须有终局；(4) next_wakeup 任意时刻不为 null；(5) 演化函数无死状态。', pa: 'PA2' }
        ]
      },
      {
        id: 'G4', label: 'G4 开放演化性',
        short: '有效进展定义 P(s)、进展追踪、软/强逃离机制',
        paRoots: ['PA8'],
        tTargets: ['T4'],
        desc: '具体化 PA8（语义进展）；服务 T4（开放演化）。G4 与 G3 的区别：G3 保证"系统还活着"；G4 保证"活着的方式有语义意义"。',
        subReqs: [
          { id: 'G4-R001', level: '硬要求', title: '有效进展定义（P(s) 投影）', desc: '强任务场（task_binding∈{strong,mission_locked}）：P(s) 由 PROGRESS_ACTIONS 白名单决定（submit_deliverable / update_agenda / satisfy_obligation / close_context 等）。弱任务/社交场：状态更新、关系承诺变化、上下文关闭等更弱但可验证的投影。普通消息/短回复/acknowledge 不算进展。', pa: 'PA8' },
          { id: 'G4-R002', level: '硬要求', title: '进展追踪 last_progress_at', desc: '系统必须追踪"上次有效进展时间戳"，只有 G4-R001 定义的、与该场类型匹配的 progress event 才能刷新此字段。强任务场必须启用严格追踪。', pa: 'PA8' },
          { id: 'G4-R003', level: '硬要求', title: '逃离机制必须存在', desc: '若系统进入"P(s) 无净变化"的循环，必须存在能逃离该循环的机制，且该机制不依赖人工干预（自主触发）。', pa: 'PA8' },
          { id: 'G4-R004', level: '硬要求', title: '软逃离：N 轮无进展注入告警', desc: '连续 N 轮（推荐 N=5）无有效进展时，系统必须向相关 agent 注入 urgent 级系统信号，agent 获得逃离当前前景场的权限（push null 帧或 pop 当前帧）。', pa: 'PA8' },
          { id: 'G4-R005', level: '硬要求', title: '强逃离：2N 轮后强制退出', desc: '连续 2N 轮无有效进展时，系统必须提供强制退出机制（不依赖 agent 自主意愿），将 ForegroundStack 帧标记为 returnable=false 并触发级联清理。', pa: 'PA8' },
          { id: 'G4-R007', level: '禁止项', title: '消息流动 ≠ 语义进展', desc: '系统不得因为有持续的消息/通知流动就认为系统在语义上进展。"有消息活动"和"有有效进展（P(s) 净变化）"是两个独立的判断。', pa: 'PA8' }
        ]
      },
      {
        id: 'G5', label: 'G5 语义有效耦合',
        short: 'Field×Activity 建模、感知正确性、动作正确性、规范性',
        paRoots: ['PA7', 'PA9'],
        tTargets: ['T5'],
        desc: '具体化 PA7（信息可达性）、PA9（观察—行动耦合）；服务 T5（有效耦合）。三组保证：感知正确性（信息可达）、动作正确性（行动有效）、规范性（义务与生命周期）。',
        subReqs: [
          { id: 'G5-R001/R002', level: '硬要求', title: 'Field 与 Activity 必须分开建模', desc: 'Field 表示外部交互环境/结构（外在）；Activity 表示主体当前行为方式（内在）。运行时行为必须由 field_profile × activity_profile × agent_state 三者共同决定，缺一不可。', pa: 'PA9' },
          { id: 'G5-R004', level: '硬要求', title: 'FieldProfile 最小 8 维', desc: 'arity · co_presence · synchrony · lifecycle · task_binding · visibility · attention_impact · normative_force。维度驱动行为，不按产品名称（"论坛"/"群聊"）建模。', pa: 'PA9' },
          { id: 'G5-R005', level: '硬要求', title: 'ActivityRuntimeProfile 最小 7 维', desc: 'mode · medium · input_openness · output_bandwidth · interrupt_tolerance · energy_profile · mobility。', pa: 'PA9' },
          { id: 'G5-R009', level: '硬要求', title: 'local/external 注入门槛区分', desc: '来自当前前景场内部的事件（local）与来自其他场的事件（external）必须使用不同的注入门槛（canInject）和唤醒门槛（canWakeup）。前景场内部事件应具备更低的注入/唤醒门槛。', pa: 'PA7' },
          { id: 'G5-R010', level: '硬要求', title: '生命威胁强制唤醒', desc: '对 semantic_class∈{hazard, evacuation, emergency} 的通知，必须存在强制唤醒覆盖通道，无视当前所有注意力门槛。', pa: 'PA7' },
          { id: 'G5-R017', level: '硬要求', title: '动作可达域由场与活动共同决定', desc: 'effective_actions = (allowedActions(foreground_field) ∪ allowedActions(physical_location_field)) ∩ actionsAffordedByMedium ∩ actionsAllowedByBandwidth ∩ actionsAllowedByMobility ∩ actionsSupportedByCapability。', pa: 'PA9' },
          { id: 'G5-R022', level: '硬要求', title: 'closeCondition 必须存在', desc: 'ephemeral：参与者散尽/空闲超时关闭；bounded：agenda 完成/deadline/主持人关闭；persistent：手动关闭。任何场类型都必须有明确的关闭路径。', pa: 'PA6' }
        ]
      },
      {
        id: 'G6', label: 'G6 一致性与可追溯性',
        short: 'Event Log 真源、因果顺序、先写事件再物化、防 Split-Brain',
        paRoots: ['PA5', 'PA6'],
        tTargets: ['T1', 'T2'],
        desc: '具体化 PA5（写权唯一——审计侧）、PA6（效应有终局——审计侧）；服务 T1（部分）、T2（部分）。G6 与 G5 是并行关系：G5 保证功能正确，G6 保证可追溯。两者在概念上互不依赖，在工程上局部互撑。',
        subReqs: [
          { id: 'G6-R001', level: '硬要求', title: '所有 durable 变更必须产生可重放事件记录', desc: '所有 durable 状态变更最终都必须产生可重放的事件记录，写入 Global Event Log。规范 durable 状态必须能以 Event Log 为准重建（crash recovery 的前提）。WritebackLedger 只能作为索引/加速层。', pa: 'PA5' },
          { id: 'G6-R004', level: '硬要求', title: '因果顺序由 causal_parent_ids 决定', desc: 'WriteEvent 的应用顺序由 causal_parent_ids（逻辑时钟）决定，而非 created_at（wall clock）。保证断网重连后批量提交的 Event 不会因物理时钟偏差而因果颠倒。', pa: 'PA5' },
          { id: 'G6-R005', level: '硬要求', title: '先写事件再物化状态', desc: '任何影响 durable 状态的写回，应先写入 Global Event Log 中的 WriteEvent（含 idempotency_key），再物化状态。保证崩溃恢复时以 Event Log 为规范 replay，且幂等性保证多次 replay 不产生副作用。', pa: 'PA5' },
          { id: 'G6-R006', level: '硬要求', title: 'ActionReceipt 确认后才写回 durable 记忆', desc: 'LLM 不应在动作发出时假设成功并立即写回记忆（Split-Brain 问题）。对任何声称产生 durable 世界效果的动作，必须提供 ActionReceipt；LLM 必须等到 receipt 确认后才提交"已成功"的 durable 写回。', pa: 'PA5' }
        ]
      },
      {
        id: 'G7', label: 'G7 认知连续性',
        short: 'memory 真状态、分层访问、域隔离、中断恢复（LLM agent 特化）',
        paRoots: ['PA2', 'PA4', 'PA5'],
        tTargets: ['T3'],
        desc: '具体化 PA2（记忆有界）、PA4（再进入——中断恢复）、PA5（记忆持有者唯一）；服务 T3（LLM-based agent 特化）。重要：G7 是 LLM-based agent 系统的特化目标，以 G3+G6 为前置依赖，不修改 G1 的合法状态域定义。',
        subReqs: [
          { id: 'G7-R001', level: '硬要求', title: 'memory 作为 durable 真状态', desc: '每个智能体的 memory 必须是 durable 真状态，不得被当作随时可丢弃的缓存。memory 中的内容（identity、persona、工作记忆等）必须在跨演化轮次间保持连续，不应因系统重启而丢失。', pa: 'PA5' },
          { id: 'G7-R002', level: '硬要求', title: 'memory 分层访问与认知连续性', desc: 'memory 必须支持分层存储（persistent/long/working）和按需检索。关键记忆（self-model、今日记忆、活跃工作上下文）在每次演化中必然被注入，不依赖偶然的检索匹配。', pa: 'PA2' },
          { id: 'G7-R003', level: '硬要求', title: 'source_field_id 域隔离（Memory Bleed 防护）', desc: '每条 MemoryEntry 必须携带 source_field_id（产生该记忆时的前景场 id），由系统在 commitWriteEvent 时自动注入，LLM 不得覆写。跨场记忆进入须满足严格语义阈值（relevance ≥ 0.85 且条数有上限）。', pa: 'PA5' },
          { id: 'G7-R004', level: '硬要求', title: 'ForegroundStack 认知连续性语义', desc: '中断后 pop 操作必须包含：Stale Frame 校验（跳过已关闭的场）+ 物理位置一致性校验（co_located 场）+ 条件性 active_key 恢复（尊重中断期间 LLM 的主动修改）。', pa: 'PA4' },
          { id: 'G7-R005', level: '硬要求', title: 'resume_token 中断恢复', desc: 'pushForeground 时系统必须生成 resume_token，保存被中断时的上下文快照（resumed_context_id、resumed_active_key、context_snapshot_hash）。popForeground 时校验：valid→完整恢复；session_compacted→注入软提示；ttl_expired/context_closed→不注入。', pa: 'PA4' }
        ]
      },
      {
        id: 'G8', label: 'G8 工程鲁棒性',
        short: 'busy-loop / crash recovery / split-brain / 迟滞锁 / N-tick 逃生',
        paRoots: ['PA2', 'PA3', 'PA4', 'PA5', 'PA6', 'PA8'],
        tTargets: ['T2', 'T3', 'T4'],
        desc: 'PA2–PA9 在真实计算机系统有限资源和故障环境中的现实增强。删掉 G8 后，G0–G7 的逻辑结构不坍塌，但实现层更容易出现抖动、漂移、double-write 或崩溃。G8 是工程实现手段，不是新的逻辑目标。',
        subReqs: [
          { id: 'G8-R001', level: '工程增强', title: 'busy-loop 防护', desc: 'next_wakeup ≤ now 时不能进入忙等。推荐：next_wakeup = max(computed, now + MIN_WAKEUP_INTERVAL_SEC)，防止 time-driven 链产生高频空转。', pa: 'PA4' },
          { id: 'G8-R002', level: '工程增强', title: 'crash recovery', desc: '系统崩溃重启后，必须以 Global Event Log 为规范恢复源 replay durable 状态。推荐：重启时对所有过期的 next_wakeup 进行 jitter 重置（防唤醒风暴）。', pa: 'PA5' },
          { id: 'G8-R003', level: '工程增强', title: 'split-brain 防护', desc: '防止"记忆说动作成功了，世界说没成功"的不一致状态。通过 StagingLedger + ActionReceipt 状态机实现（G6-R006 的工程保障）。', pa: 'PA5' },
          { id: 'G8-R006', level: '工程增强', title: 'Hysteresis Lock（能量迟滞锁）', desc: '防止 energy 在阈值附近产生高频微震荡（consuming→resting→consuming 无限循环）。energy ≤ 0 时激活 energy_recovery_lock，强制切换 recovering 活动；满足解锁双条件后解锁。', pa: 'PA3' },
          { id: 'G8-R007', level: '工程增强', title: 'MAX_DELTA_T 截断（72h）', desc: 'Δt = clamp(max(0, now - last_evolved_at), 0, MAX_DELTA_T_HOURS)（推荐 72h）。防止系统离线后重连时 Δt 过大导致 energy 语义失真。', pa: 'PA2' },
          { id: 'G8-R009', level: '工程增强', title: 'N-tick 超时逃生（G4 的工程实现）', desc: '软超时（N tick）：last_progress_at 超过阈值时注入 urgent 系统告警，agent 可选择 pop 当前帧。严格超时（2N tick）：强制解绑（returnable=false）。有效进展由 G4-R001 的 PROGRESS_ACTIONS 白名单决定。G4 是理论要求，G8-R009 是工程实现端点。', pa: 'PA8' },
          { id: 'G8-R013', level: '工程增强', title: 'Notification Sweeper', desc: 'notification_buffer 需要定期清理（Sweeper），将过期（TTL 到期）、已归档的通知从队列中移除，保证 notification_buffer 空间有界（G3-R008 的工程实现）。', pa: 'PA6' }
        ]
      }
    ]
  },

  /* ───────────────────────── T→PA 映射边 ───────────────────────────── */
  edgesT2PA: [
    { from: 'T1', to: 'PA1' }, { from: 'T1', to: 'PA5' },
    { from: 'T2', to: 'PA2' }, { from: 'T2', to: 'PA5' }, { from: 'T2', to: 'PA6' },
    { from: 'T3', to: 'PA2' }, { from: 'T3', to: 'PA3' }, { from: 'T3', to: 'PA4' }, { from: 'T3', to: 'PA6' },
    { from: 'T4', to: 'PA8' },
    { from: 'T5', to: 'PA7' }, { from: 'T5', to: 'PA9' }, { from: 'T5', to: 'PA1' }
  ],

  /* ───────────────────────── PA→G 映射边 ───────────────────────────── */
  edgesPA2G: [
    { from: 'PA1', to: 'G0' }, { from: 'PA1', to: 'G2' },
    { from: 'PA2', to: 'G1' }, { from: 'PA2', to: 'G3' }, { from: 'PA2', to: 'G8' },
    { from: 'PA3', to: 'G3' }, { from: 'PA3', to: 'G8' },
    { from: 'PA4', to: 'G2' }, { from: 'PA4', to: 'G3' }, { from: 'PA4', to: 'G7' },
    { from: 'PA5', to: 'G0' }, { from: 'PA5', to: 'G1' }, { from: 'PA5', to: 'G6' }, { from: 'PA5', to: 'G8' },
    { from: 'PA6', to: 'G1' }, { from: 'PA6', to: 'G3' }, { from: 'PA6', to: 'G5' },
    { from: 'PA7', to: 'G2' }, { from: 'PA7', to: 'G5' },
    { from: 'PA8', to: 'G4' }, { from: 'PA8', to: 'G8' },
    { from: 'PA9', to: 'G0' }, { from: 'PA9', to: 'G5' }
  ],

  /* ───────────────────────── 层级说明 ───────────────────────────── */
  layers: {
    T: {
      name: 'T 层', fullName: '本质目标层',
      desc: '任意「智能体—世界」多主体系统若要长期持续存在并有效运行，必须追求的本质性质。与具体实现无关。违反 T 层不是"系统跑得不好"，而是"系统不再是我们讨论的那类系统"。',
      interLogicToNext: '为保住这些目标，系统在结构上至少必须满足什么 →',
      intraLogic: [
        'T1 是所有后续目标的前提；不成立则无法讨论运行、正确性、稳定性。',
        'T2 依赖 T1（先有定义，才能谈合法性）；T3 依赖 T1+T2（合法存在才能谈持续）。',
        'T4 以 T3 为前提：T3 保证「还能动」，T4 保证「动的不是空转」。',
        'T5（有效耦合）依赖 T1：主体/环境可区分是定义耦合方向的前提。'
      ]
    },
    PA: {
      name: 'PA 层', fullName: '抽象公理层',
      desc: '若系统想保住 T1–T5，则在结构上至少必须满足的抽象条件。T 与 G 之间的桥梁。比 T 更具体（有结构含义），但比 G 更抽象（与粒子体系无关）。',
      interLogicToNext: '这些公理在当前粒子体系中如何落地 →',
      intraLogic: [
        '5组分类：定义组（PA1,PA5）/ 边界组（PA2,PA6）/ 生存组（PA3,PA4）/ 进展组（PA8）/ 耦合组（PA7,PA9）。',
        'PA2↔PA3 互补：有界（不上溢）+ 可恢复（不单调耗尽）= 资源稳定。',
        'PA4↔PA8 互补：再进入机会（存在性）+ 语义进展（质量性）= 运行活性。',
        'PA6↔PA7 互补：效应有终局 + 信息可达 = 效应—接收—终局闭环。',
        'PA7↔PA9 互补：观察侧（信息到达）+ 行动侧（净效果）= T5 双向耦合。',
        'PA8 独立对应 T4：语义进展的直接公理化，无其他公理可替代。'
      ]
    },
    G: {
      name: 'G 层', fullName: '当前系统目标层',
      desc: 'PA 在本系统（异步耦合粒子体系）中的具体化。与 world/agents/meta、FieldProfile 等绑定。每条 G 要求须能向上追溯到至少一条 PA 公理，该公理须能追溯到至少一个 T 目标。',
      interLogicToNext: null,
      intraLogic: [
        'G0 不依赖 G1–G8，是最底层存在性定义。',
        '核心串行链：G0→G1→G2→G3→G4（前者是后者的前置依赖）。',
        'G5 与 G6 并行：G5 保证功能正确，G6 保证可追溯，互不依赖。',
        'G7 依赖 G3、G6（特化目标），是 LLM-based agent 的专属要求。',
        'G8 依赖 G0–G7，是工程增强；删掉 G8 后 G0–G7 逻辑不坍塌。'
      ]
    }
  },

  /* ───────────────────────── PA 互补对 ───────────────────────────── */
  pairings: [
    {
      id: 'pair-res',
      pa1: 'PA2', pa2: 'PA3',
      name: '资源稳定互补对',
      tagline: 'PA2（防爆炸）↔ PA3（防耗尽）',
      detail: '两者合起来保证资源处于"有界且有恢复路径"的健康区间。\n\nPA2 单独不够：有上界但单调下降，最终还是停机。\nPA3 单独不够：有恢复但无上界，最终还是爆炸。\n\n合起来：资源处于 [R_min, B_R] 内的长时健康区间。',
      serves: 'T3（持续演化）'
    },
    {
      id: 'pair-effect',
      pa1: 'PA6', pa2: 'PA7',
      name: '效应生命周期互补对',
      tagline: 'PA6（防永挂）↔ PA7（防永失）',
      detail: 'PA6 防止"效应永远挂起"——通知、义务等无法进入终态。\nPA7 防止"信息永远到不了"——合法接收者收不到信息。\n\n两者共同保证效应的"发出—接收—终局"完整闭环。',
      serves: 'T2（合法性）、T5（有效耦合）'
    },
    {
      id: 'pair-couple',
      pa1: 'PA7', pa2: 'PA9',
      name: '耦合双向互补对',
      tagline: 'PA7（观察侧）↔ PA9（行动侧）',
      detail: 'PA7 保证主体能观察到环境（信息到达）。\nPA9 保证主体能作用于环境（行动有效）。\n\n缺 PA7：主体是盲目执行器（不知道环境状态就在动）。\n缺 PA9：主体是纯被动接收器（能看到一切但无法改变任何东西）。\n\n两者共同构成 T5 有效耦合的双向闭环。',
      serves: 'T5（有效耦合）'
    },
    {
      id: 'pair-liveness',
      pa1: 'PA4', pa2: 'PA8',
      name: '运行活性互补对',
      tagline: 'PA4（防永无机会）↔ PA8（防机会全空转）',
      detail: 'PA4 保证"系统总能被再次触发演化"（存在性条件）。\nPA8 保证"被触发的演化产生语义进展"（质量性条件）。\n\n缺 PA4：agent 静默，永远不被唤醒（静态系统）。\n缺 PA8：agent 被不断唤醒，但每次都在空转，没有语义进展（假活性）。\n\n两者层次不同：PA4 是"有没有机会"，PA8 是"机会是否有意义"。',
      serves: 'T3（持续演化）、T4（开放演化）'
    }
  ],

  /* ────────────────────── PA→T 服务矩阵 ─────────────────────────────
     ● = 主要服务（缺失则该 T 直接失效）
     ○ = 次要服务（缺失对该 T 有影响但非直接）
     空 = 无直接关系
  ────────────────────────────────────────────────────────────────── */
  serviceMatrix: [
    { pa: 'PA1', T1: '●', T2: '○', T3: '○', T4: '○', T5: '●' },
    { pa: 'PA2', T1: '○', T2: '●', T3: '●', T4: '○', T5: '○' },
    { pa: 'PA3', T1: '○', T2: '○', T3: '●', T4: '○', T5: '○' },
    { pa: 'PA4', T1: '○', T2: '○', T3: '●', T4: '○', T5: '●' },
    { pa: 'PA5', T1: '●', T2: '●', T3: '○', T4: '○', T5: '○' },
    { pa: 'PA6', T1: '○', T2: '●', T3: '●', T4: '○', T5: '○' },
    { pa: 'PA7', T1: '○', T2: '○', T3: '○', T4: '○', T5: '●' },
    { pa: 'PA8', T1: '○', T2: '○', T3: '○', T4: '●', T5: '○' },
    { pa: 'PA9', T1: '●', T2: '○', T3: '○', T4: '○', T5: '●' }
  ],

  /* ────────────────────── G 层依赖矩阵 ──────────────────────────────
     ● = 强前置依赖（行依赖列；缺列则行失去意义）
     ○ = 弱依赖（有影响但非直接前置）
     ↑ = 工程增强（G8 增强 G0–G7，但非逻辑前置）
     — = 自身
     空 = 无依赖
  ────────────────────────────────────────────────────────────────── */
  gDepMatrix: {
    G0: { G0: '—' },
    G1: { G0: '●', G1: '—' },
    G2: { G0: '●', G1: '●', G2: '—' },
    G3: { G0: '●', G1: '●', G2: '●', G3: '—' },
    G4: { G0: '○', G1: '○', G2: '○', G3: '●', G4: '—' },
    G5: { G0: '●', G1: '○', G2: '●', G3: '○', G4: '○', G5: '—' },
    G6: { G0: '●', G1: '●', G2: '○', G3: '○', G4: '○', G5: '○', G6: '—' },
    G7: { G0: '○', G1: '○', G2: '○', G3: '●', G4: '○', G5: '○', G6: '●', G7: '—' },
    G8: { G0: '↑', G1: '↑', G2: '↑', G3: '↑', G4: '↑', G5: '↑', G6: '↑', G7: '↑', G8: '—' }
  },

  /* ──────────────────────── 追溯链示例 ───────────────────────────────
     每个示例展示一条从 T 到具体 G 要求的完整推导链
  ────────────────────────────────────────────────────────────────── */
  traces: [
    {
      id: 'trace1',
      label: 'G3-R003: next_wakeup 永不为 null',
      nodes: ['T3', 'PA4', 'G3'],
      req: 'G3-R003',
      reqDesc: '任意时刻，任意 agent 的 next_wakeup 必须是有效时间戳，不得为 null。若本轮 LLM 输出未给出 next_wakeup，系统必须按默认策略自动填入。',
      chain: [
        { id: 'T3', role: '本质目标', text: 'T3（持续演化）：系统必须能在理想条件下无限时间演化，不因内部机制而停止。' },
        { id: 'PA4', role: '公理化', text: 'PA4（持续再进入）：系统在任意可达状态下，都必须在有限时间内重新获得一次合法演化机会。在粒子体系中，"获得演化机会" = 被调度器唤醒。' },
        { id: 'G3', role: '具体化', text: 'G3（持续稳定性）：调度链不断是稳定性的核心保障。具体化为：time-driven 调度 + event-driven 调度 + next_wakeup 不为 null 的关键不变量。' },
        { id: 'G3-R003', role: '精化要求', text: 'G3-R003 [next_wakeup 永不为 null]：任意时刻，任意 agent 的 next_wakeup 必须是有效时间戳。若 LLM 输出未给出，系统必须按默认策略自动填入。' }
      ],
      violation: '若 next_wakeup 可以为 null → 调度器无法设置下次唤醒 → time-driven 调度链断裂 → PA4 被违反（系统在该 agent 处无法在有限时间内重新演化）→ T3 被违反（持续演化目标失效）。\n\n案例：agent 崩溃重启后 next_wakeup 未被恢复，系统没有任何机制再次唤醒它，永久沉默。'
    },
    {
      id: 'trace2',
      label: 'G4-R001: 有效进展定义（P(s) 投影）',
      nodes: ['T4', 'PA8', 'G4'],
      req: 'G4-R001',
      reqDesc: '系统必须为当前场景定义"有效语义进展"（progress projection P(s)），使得能区分"真实推进"（P(s) 净变化）与"形式空转"（P(s) 无变化）。强任务场用 PROGRESS_ACTIONS 白名单；弱任务/社交场用更弱但可验证的投影。',
      chain: [
        { id: 'T4', role: '本质目标', text: 'T4（开放演化）：系统不仅要能持续运行，还要避免在非预期条件下陷入无语义进展的病态循环。' },
        { id: 'PA8', role: '公理化', text: 'PA8（语义进展）：必须存在目标相关的进展投影 P(s)，且若 P(s) 在循环中无净变化，须有非零概率逃离机制（不依赖人工干预）。' },
        { id: 'G4', role: '具体化', text: 'G4（开放演化性）：具体化 PA8，要求定义 P(s)、追踪 last_progress_at、并实现软/强逃离机制。' },
        { id: 'G4-R001', role: '精化要求', text: 'G4-R001 [有效进展定义]：按场类型分层定义 P(s)。强任务场：PROGRESS_ACTIONS 白名单（submit_deliverable / update_agenda / satisfy_obligation 等）。弱任务/社交场：状态更新、关系承诺变化、上下文关闭等。' }
      ],
      violation: '若无 P(s) 定义 → 系统无法区分真实进展与形式空转 → 义务循环死锁、消息空转均无法被检测 → 系统陷入病态循环但无法自主发现 → T4 失效。\n\n案例：5 个 agent 持续相互发"我在思考"，200 轮后任何 deliverable 都未产生，但系统认为"有活动所以没问题"。'
    },
    {
      id: 'trace3',
      label: 'G7-R003: source_field_id 域隔离（Memory Bleed 防护）',
      nodes: ['T3', 'PA5', 'G7'],
      req: 'G7-R003',
      reqDesc: '每条 MemoryEntry 必须携带 source_field_id（产生该记忆时的前景场 id），由系统在 commitWriteEvent 时自动注入，LLM 不得覆写。assembleMemory 时优先同源记忆；跨场记忆进入需满足严格语义阈值。',
      chain: [
        { id: 'T3', role: '本质目标', text: 'T3（持续演化）：对 LLM-based agent 来说，持续演化包括跨中断的认知连续性——记忆需要在场景切换后保持有序可用。' },
        { id: 'PA5', role: '公理化', text: 'PA5（写权唯一性）：每个 durable 状态分量只有一个权威写者。记忆域的写权限同样需要明确归属，每条记忆必须有可追溯的来源标注。' },
        { id: 'G7', role: '具体化（特化）', text: 'G7（认知连续性）：LLM-based agent 的特化目标。PA5 在记忆写入上的应用：memory 必须有明确来源归属，防止跨场污染（Memory Bleed）。' },
        { id: 'G7-R003', role: '精化要求', text: 'G7-R003 [source_field_id 域隔离]：每条 MemoryEntry 必须携带 source_field_id。assembleMemory 时优先同源记忆；跨场记忆进入须满足 cross_context_relevance ≥ 0.85 且条数有上限。' }
      ],
      violation: '若 memory 无域隔离 → 跨场记忆可自由混入当前场 → LLM context 中出现无关场景的记忆片段 → 认知语义混乱（"这次任务"和"上次聊天"的记忆相互污染）→ LLM 输出质量崩塌 → T3 在 LLM agent 上失效。'
    },
    {
      id: 'trace4',
      label: 'G8-R009: N-tick 超时逃生（工程层实现）',
      nodes: ['T4', 'PA8', 'G4', 'G8'],
      req: 'G8-R009',
      reqDesc: '对前景场长期无有效进展（last_progress_at 超过阈值）：软超时（N tick）注入 urgent 系统告警，agent 可选择 pop 当前帧；严格超时（2N tick）强制解绑（returnable=false）。有效进展由 G4-R001 定义的 PROGRESS_ACTIONS 白名单决定。',
      chain: [
        { id: 'T4', role: '本质目标', text: 'T4（开放演化）：系统不能在非预期条件下陷入无语义进展的循环。' },
        { id: 'PA8', role: '公理化', text: 'PA8（语义进展）：必须存在 P(s) 投影和不依赖人工干预的逃离机制。逃离概率 > 0（非确定性，但一定非零）。' },
        { id: 'G4', role: '理论层具体化', text: 'G4-R003/004/005（逃离机制）：理论要求"逃离机制必须存在"。G4 是理论层，定义"需要什么"。' },
        { id: 'G8', role: '工程层实现', text: 'G8-R009 [N-tick 超时逃生]：具体工程实现。N tick 无进展→软超时注入 urgent 信号；2N tick→强制解绑。G8 是实现手段，不是新的逻辑目标。' }
      ],
      violation: '若无超时机制 → 系统无法自主检测无进展状态 → 任何义务循环死锁或 LLM 空转循环都将持续到人工干预 → T4 的"不依赖人工干预逃离"条件失效。\n\n注：G8-R009 不是凭空设计的，它是 T4→PA8→G4→G8 整条逻辑链的工程实现端点。G4 是理论要求，G8 是工程实现，两者有明确分工。'
    },
    {
      id: 'trace5',
      label: 'G1-R007: energy ∈ [0, 100]（能量有界不变量）',
      nodes: ['T2', 'PA2', 'G1'],
      req: 'G1-R007',
      reqDesc: '任意时刻：energy ∈ [0, 100]。所有 energy 更新（系统物理规则 + LLM 提议）之后必须执行 clamp。',
      chain: [
        { id: 'T2', role: '本质目标', text: 'T2（合法性）：系统在任意时刻都必须处于合法状态域中。状态值域合法是最小要求之一。' },
        { id: 'PA2', role: '公理化', text: 'PA2（有界性）：对任何可能无界增长的状态量 X，必须存在有限上界或有界控制机制。energy 是可积累/可消耗的状态量，必须有界。' },
        { id: 'G1', role: '具体化', text: 'G1（合法状态域）：PA2 在当前粒子体系中的具体化。能量有界不变量是 G1 的硬不变量之一。' },
        { id: 'G1-R007', role: '精化要求', text: 'G1-R007 [能量有界不变量]：任意时刻 energy ∈ [0, 100]。所有 energy 更新之后必须执行 clamp。LLM 提议的 llmAdjustment 也必须被 clamp 到有限范围。' }
      ],
      violation: '若 energy 无界 → agent 的 energy 可超过 100 或低于 0 → 所有依赖 energy 的判断（是否休息、是否触发 P0、输出带宽计算）都建立在非法值上 → T2 失效（系统进入非法状态），后续演化结果不可信。'
    }
  ],

  /* ───────────────────────── 辅助函数区 ───────────────────────────── */
};

/* ───────────────────────── 双语名称表 ─────────────────────────────
   来源：M0_总纲与定位.md §9 中英双语术语字典 + 体系文档标准翻译
────────────────────────────────────────────────────────────────── */
const EN_NAMES = {
  // T 层
  T1:'Definability',
  T2:'Legality',
  T3:'Continuous Evolution',
  T4:'Open Evolution',
  T5:'Effective Coupling',
  // PA 层
  PA1:'Agent-Env Distinguishability',
  PA2:'State Boundedness',
  PA3:'Resource Recoverability',
  PA4:'Guaranteed Rescheduling',
  PA5:'Unique Write Authority',
  PA6:'Guaranteed Effect Resolution',
  PA7:'Information Reachability',
  PA8:'Semantic Progression',
  PA9:'Observation-Action Coupling',
  // G 层
  G0:'Ontological Structure',
  G1:'Legal State Domain',
  G2:'Step Completeness',
  G3:'Sustained Stability',
  G4:'Open Evolution Property',
  G5:'Semantic Effective Coupling',
  G6:'Consistency & Traceability',
  G7:'Cognitive Continuity',
  G8:'Engineering Robustness'
};

/* ───────────────── 有向图谱：带标签的全量边定义 ───────────────────
   用于 viz-graph.html 的有向关系图谱视图
   type: T_int=T层内部  T2PA=T→PA  PA_pair=PA互补对  PA2G=PA→G  G_int=G层内部
────────────────────────────────────────────────────────────────── */
const GRAPH_EDGES = [
  // ── T 层内部（串行依赖链 + T1→T5 并行）──
  {from:'T1',to:'T2', type:'T_int', label:'T2 depends on T1 — legality requires the system to be formally defined first'},
  {from:'T2',to:'T3', type:'T_int', label:'T3 depends on T1+T2 — sustained evolution requires legal existence'},
  {from:'T3',to:'T4', type:'T_int', label:'T4 depends on T3 — "meaningful?" only makes sense if still running'},
  {from:'T1',to:'T5', type:'T_int', label:'T5 depends on T1 — coupling direction needs system definition first'},

  // ── T → PA（为何每条 PA 对该 T 是必要的）──
  {from:'T1',to:'PA1', type:'T2PA', label:'T1 needs PA1: state space must have formally distinct agent / env structure'},
  {from:'T1',to:'PA5', type:'T2PA', label:'T1 needs PA5: state traceability requires unique write authority'},
  {from:'T2',to:'PA2', type:'T2PA', label:'T2 needs PA2: unbounded state violates the legal domain'},
  {from:'T2',to:'PA5', type:'T2PA', label:'T2 needs PA5: conflicting writers produce contradictory, illegal state'},
  {from:'T2',to:'PA6', type:'T2PA', label:'T2 needs PA6: indefinitely pending effects make system state undefined'},
  {from:'T3',to:'PA2', type:'T2PA', label:'T3 needs PA2: unbounded growth halts evolution in finite time'},
  {from:'T3',to:'PA3', type:'T2PA', label:'T3 needs PA3: without recovery path, resource depletion is permanent'},
  {from:'T3',to:'PA4', type:'T2PA', label:'T3 needs PA4: without re-entry guarantee, system silently stops forever'},
  {from:'T3',to:'PA6', type:'T2PA', label:'T3 needs PA6: accumulated pending effects exhaust resources'},
  {from:'T4',to:'PA8', type:'T2PA', label:'T4 needs PA8: semantic idling must be detectable and escapable'},
  {from:'T5',to:'PA1', type:'T2PA', label:'T5 needs PA1: coupling direction requires agent / env distinction'},
  {from:'T5',to:'PA7', type:'T2PA', label:'T5 needs PA7: observation side — info must reach agents'},
  {from:'T5',to:'PA9', type:'T2PA', label:'T5 needs PA9: action side — actions must affect the world'},

  // ── PA 层互补对（双向）──
  {from:'PA2',to:'PA3', type:'PA_pair', label:'Resource pair: PA2 prevents overflow ↔ PA3 prevents depletion'},
  {from:'PA3',to:'PA2', type:'PA_pair', label:'Resource pair: PA3 prevents depletion ↔ PA2 prevents overflow'},
  {from:'PA6',to:'PA7', type:'PA_pair', label:'Effect lifecycle: PA6 prevents indefinite pending ↔ PA7 prevents lost delivery'},
  {from:'PA7',to:'PA6', type:'PA_pair', label:'Effect lifecycle: PA7 prevents lost delivery ↔ PA6 prevents indefinite pending'},
  {from:'PA7',to:'PA9', type:'PA_pair', label:'Bidirectional coupling: PA7 = observation side ↔ PA9 = action side'},
  {from:'PA9',to:'PA7', type:'PA_pair', label:'Bidirectional coupling: PA9 = action side ↔ PA7 = observation side'},
  {from:'PA4',to:'PA8', type:'PA_pair', label:'Liveness pair: PA4 = has scheduling chance ↔ PA8 = chance is meaningful'},
  {from:'PA8',to:'PA4', type:'PA_pair', label:'Liveness pair: PA8 = chance is meaningful ↔ PA4 = has scheduling chance'},

  // ── PA → G（公理在当前体系中如何具体化）──
  {from:'PA1',to:'G0', type:'PA2G', label:'PA1→G0: particle triad (V_P,View_P,R_P), 3-layer state, source-of-truth table'},
  {from:'PA1',to:'G2', type:'PA2G', label:'PA1→G2: 4-phase evolution must be complete; no dead states'},
  {from:'PA2',to:'G1', type:'PA2G', label:'PA2→G1: energy ∈ [0,100]; all accumulative state quantities bounded'},
  {from:'PA2',to:'G3', type:'PA2G', label:'PA2→G3: memory bounded; notification buffer bounded; contexts closeable'},
  {from:'PA2',to:'G8', type:'PA2G', label:'PA2→G8 (eng): MAX_DELTA_T truncation; Notification Sweeper'},
  {from:'PA3',to:'G3', type:'PA2G', label:'PA3→G3: energy recovery path must exist AND be reachable in practice'},
  {from:'PA3',to:'G8', type:'PA2G', label:'PA3→G8 (eng): Hysteresis Lock; sleep_debt tracking'},
  {from:'PA4',to:'G2', type:'PA2G', label:'PA4→G2: 4-phase evolution is the atomic re-entry scheduling unit'},
  {from:'PA4',to:'G3', type:'PA2G', label:'PA4→G3: next_wakeup ≠ null at all times; time/event-driven scheduling'},
  {from:'PA4',to:'G7', type:'PA2G', label:'PA4→G7: ForegroundStack resume; resume_token for interrupted contexts'},
  {from:'PA5',to:'G0', type:'PA2G', label:'PA5→G0: Source of Truth Table nailed down; storage ownership topology'},
  {from:'PA5',to:'G1', type:'PA2G', label:'PA5→G1: write isolation invariant; unique Event Log as normative source'},
  {from:'PA5',to:'G6', type:'PA2G', label:'PA5→G6: WriteEvent-first protocol; causal_parent_ids ordering'},
  {from:'PA5',to:'G8', type:'PA2G', label:'PA5→G8 (eng): split-brain guard; causal topology sort'},
  {from:'PA6',to:'G1', type:'PA2G', label:'PA6→G1: every Notification must enter terminal state (consumed/expired/…)'},
  {from:'PA6',to:'G3', type:'PA2G', label:'PA6→G3: TTL cleanup enforced; bounded/ephemeral contexts must be closeable'},
  {from:'PA6',to:'G5', type:'PA2G', label:'PA6→G5: closeCondition must exist for every context lifecycle type'},
  {from:'PA7',to:'G2', type:'PA2G', label:'PA7→G2: assemble must include all visible notifications in the input context'},
  {from:'PA7',to:'G5', type:'PA2G', label:'PA7→G5: local/external threshold split; hazard-class override (no filter)'},
  {from:'PA8',to:'G4', type:'PA2G', label:'PA8→G4: P(s) progress projection defined; last_progress_at tracked; escape mechanisms'},
  {from:'PA8',to:'G8', type:'PA2G', label:'PA8→G8 (eng): N-tick timeout breaker (G8-R009 is the engineering implementation)'},
  {from:'PA9',to:'G0', type:'PA2G', label:'PA9→G0: shared world structure — not isolated per-agent world copies'},
  {from:'PA9',to:'G5', type:'PA2G', label:'PA9→G5: Field×Activity modeling; action reachability domain formula'},

  // ── G 层内部（依赖链 + 并行关系 + 特化关系）──
  {from:'G0',to:'G1', type:'G_int', label:'G1 requires G0: cannot define legal invariants without system existence'},
  {from:'G1',to:'G2', type:'G_int', label:'G2 requires G1: evolution completeness needs legal state bounds first'},
  {from:'G2',to:'G3', type:'G_int', label:'G3 requires G2: sustained operation needs each step to complete'},
  {from:'G3',to:'G4', type:'G_int', label:'G4 requires G3: "meaningful?" only makes sense if system is still alive'},
  {from:'G0',to:'G5', type:'G_int', label:'G5 requires G0: semantic coupling needs ontological structure defined'},
  {from:'G2',to:'G5', type:'G_int', label:'G5 requires G2: action routing needs the emit→route→apply pipeline'},
  {from:'G0',to:'G6', type:'G_int', label:'G6 requires G0: audit Event Log needs storage ownership topology'},
  {from:'G1',to:'G6', type:'G_int', label:'G6 requires G1: write authority must be clear before audit is credible'},
  {from:'G3',to:'G7', type:'G_int', label:'G7 requires G3: cognitive continuity needs system stability as foundation'},
  {from:'G6',to:'G7', type:'G_int', label:'G7 requires G6: memory crash-recovery needs Event Log as rebuild source'}
];

/* ─── 辅助：获取所有扁平节点 ─── */
function getAllNodes() {
  const list = [];
  ['T', 'PA', 'G'].forEach(layer => {
    TPAG_DATA.nodes[layer].forEach(n => list.push({ ...n, layer }));
  });
  return list;
}

/* ─── 辅助：获取所有边 ─── */
function getAllEdges() {
  const list = [];
  TPAG_DATA.edgesT2PA.forEach(e => list.push({ ...e, type: 'T2PA' }));
  TPAG_DATA.edgesPA2G.forEach(e => list.push({ ...e, type: 'PA2G' }));
  return list;
}
