/* Narulight vs Limited-Expansion PU Resin — Comparative Advantage Chapter
   Sources:
   - 防水層再生工法 simplified Touchstone 20260513.pdf (limited-expansion PU marketing materials)
   - narulight ナルライト注入用 技術資料 20260209.pdf (Narulight technical data)
   - narulight saisei 標準施工要領書 201906.pdf

   Key facts referenced:
   - Limited-expansion PU: 2-part polyurethane, 100% solids, low viscosity, slight expansion in water,
     designed for point crack injection / matrix around leak (3m radius, 30–60cm pitch).
   - Narulight: water-based C5 petroleum resin emulsion, 48% solids, Alofix MC accelerator
     (alkali-ion gelation, irreversible). Full-area regeneration at 500mm pitch, ≥3MPa.
   - Narulight resists microbial degradation by Streptomyces (放線菌); polyurethanes
     are known to be susceptible.
   - Narulight: launched 1977, 50-yr track record, zero documented re-leak claims
     since 2003 warranty program.
*/
(function(){
  'use strict';

  // ====== TRANSLATIONS ======
  const T = {
    ja: {
      nav: '比較',
      label: 'Comparative Analysis · 比較分析',
      title: 'なぜ 微膨張型ポリウレタン樹脂 ではなく、ナルライトなのか',
      lead: '微膨張型ポリウレタン樹脂はクラック単点止水に優れた 2 液型注入材ですが、流動性が低く、保護層の上下や界面全体へ確実に行き渡らせる事は困難です。ナルライトは保護層内部に広く拡散して防水層全面を再生する事を目的に設計された水性樹脂です。建物全体の防水層を再生する場合、両者の設計思想と長期性能の差は決定的になります。',

      // Two philosophies
      phil_label: 'Design Philosophy · 設計思想',
      phil_title: '同じ「注入」、まったく異なる思想',
      phil_sub: '両材料とも保護層を貫通して注入する点では共通します。しかし、なにを目的に注入するかが根本的に異なります。',

      ut_brand: '微膨張型 ポリウレタン樹脂',
      ut_brand_sub: '2 液型 限定膨張 PU 注入樹脂',
      ut_phil_t: '点 ── クラックを 1 本ずつ止める',
      ut_phil_d: '漏水点を中心に 3 m 圏内で 30〜60 cm ピッチの穴を配置し、樹脂を圧入。流動性が低いため拡散範囲は限定的で、個々のクラックを物理的に封止する事を主目的とします。',
      ut_b1_t: 'ピッチ', ut_b1_v: '300〜600 mm',
      ut_b2_t: '拡散', ut_b2_v: '⚠ 加圧注入しても拡散は限定的',
      ut_b3_t: '充填部位', ut_b3_v: 'クラック・伸縮目地内部',
      ut_b4_t: '機能', ut_b4_v: 'クラック単点止水',

      nl_brand: 'ナルライト',
      nl_brand_sub: '水性 C5 系石油樹脂エマルジョン',
      nl_phil_t: '面 ── 防水層を新生する',
      nl_phil_d: '屋上全面に 500 mm ピッチで穴を配置し、3 MPa 以上の圧力で注入。優れた流動性により保護層を物理的に持ち上げ、既設防水層の上下・界面の隙間 全体に行き渡り、連続した新しい防水層を形成します。',
      nl_b1_t: 'ピッチ', nl_b1_v: '500 mm（標準）',
      nl_b2_t: '施工範囲', nl_b2_v: '屋上全面（100%）',
      nl_b3_t: '充填部位', nl_b3_v: '保護層／防水層／スラブ 全層',
      nl_b4_t: '機能', nl_b4_v: '防水層 全面再生',

      diagA_pm:'保護モルタル', diagA_sc:'シンダーコンクリート', diagA_wl:'既設防水層', diagA_sl:'スラブ',
      diagA_leak:'漏水点', diagA_r3:'≒ 3 m', diagA_pu:'PU 単点止水',
      diagB_grid:'500 mm × 500 mm 等間隔', diagB_full:'保護層内部に新しい防水層を形成',

      // Material DNA
      dna_label: 'Material DNA · 材料 DNA',
      dna_title: '化学的 DNA の違い',
      dna_sub: '同じ注入樹脂でも、化学骨格と硬化メカニズムが全く異なります。これが長期性能を分けます。',

      dna_ut_t: '微膨張型 ポリウレタン樹脂',
      dna_nl_t: 'ナルライト',
      dna_prop_base: '主成分',
      dna_prop_state: '状態',
      dna_prop_flow: '流動性 / 拡散力',
      dna_prop_cure: '硬化機構',
      dna_prop_curetime: '硬化時間 調整',
      dna_prop_visc: '粘度',
      dna_prop_solids: '固形分',
      dna_prop_expand: '水接触時の膨張',
      dna_prop_elong: '破断時伸び率',
      dna_prop_redis: '再溶解',
      dna_prop_micro: '微生物分解',
      dna_prop_solvent: '有機溶剤',
      dna_prop_cleanup: '洗浄方法',
      dna_prop_record: '実績',

      dna_ut_base: 'イソシアネート系 2 液型ポリウレタン',
      dna_ut_state: '油性 2 液混合反応型',
      dna_ut_flow: '⚠ 低い（コーン流動試験 ≒ 10 mm）',
      dna_ut_cure: '水分・イソシアネート反応 → 発泡硬化',
      dna_ut_curetime: '⚠ 配合固定・現場での調整困難',
      dna_ut_visc: '超低粘度（< 300 cps）',
      dna_ut_solids: '100%（固形分）',
      dna_ut_expand: '⚠ 水接触で膨張・発泡（閉孔構造）。密封注入の現場では水分接触が避けられず、膨張が保護層に予期せぬ負荷を与える恐れがあります',
      dna_ut_elong: '⚠ 約 50〜90%',
      dna_ut_redis: '化学硬化後は再溶解せず',
      dna_ut_micro: '⚠ 放線菌（Streptomyces 属）により分解',
      dna_ut_solvent: 'イソシアネート溶剤系',
      dna_ut_cleanup: '専用溶剤による洗浄',
      dna_ut_record: '⚠ 本工法に関する公式技術文献なし。各地で個別採用される程度',

      dna_nl_base: 'C5 系 石油樹脂（粘着付与剤）',
      dna_nl_state: '水性 1 液型エマルジョン + アロフィクス MC',
      dna_nl_flow: '✓ 卓越（コーン流動試験 ≒ 49 mm／5 倍）',
      dna_nl_cure: 'アルカリ金属イオン反応 → 凝集ゲル化',
      dna_nl_curetime: '✓ MC 混入量 10〜20% で硬化時間を現場調整可',
      dna_nl_visc: '30,000 cps（原液）／ 6,000 cps（MC 混入後）',
      dna_nl_solids: '48%（水性エマルジョン）',
      dna_nl_expand: '✓ 無発泡・体積変化なし。水に接触しても膨張せず、保護層に余計な負荷をかけません',
      dna_nl_elong: '✓ 160%（JIS K 6251 / 両者比 約 2〜3 倍）',
      dna_nl_redis: 'ゲル化後の再溶解は一切なし（試験済）',
      dna_nl_micro: '✓ 微生物分解 されにくい',
      dna_nl_solvent: '0%（有害化学物質・有機溶剤 不使用）',
      dna_nl_cleanup: '水で洗浄可能',
      dna_nl_record: '1977 年発売以降 50 年・公式技術資料整備済・再漏水ゼロ',

      // 3 differentiators
      diff_label: 'Decisive Differences · 決定的な 3 つの違い',
      diff_title: 'ナルライトが選ばれる、3 つの決定打',

      diff1_no: '01',
      diff1_t: '微生物分解への耐性',
      diff1_sub: '30 年後も「生きている」防水層か',
      diff1_d: 'ポリウレタン系止水材は土壌・コンクリート内に棲息する 放線菌（Streptomyces 属）に分解されることが知られています。微生物に食われたウレタンは隙間が生じ、長期的に止水性能を失います。ナルライトは石油樹脂を主成分とし、微生物に分解されにくく、湿潤な保護層内部でも 50 年近い実績を持ちます。',
      diff1_stat1_v: '0', diff1_stat1_l: '再漏水クレーム件数（1977〜現在）',
      diff1_stat2_v: '26+', diff1_stat2_l: '年経過後も無漏水 確認実例（1997 大阪施工）',

      diff2_no: '02',
      diff2_t: '面で再生する設計',
      diff2_sub: '漏水点が特定できなくても完全止水',
      diff2_d: '微膨張型ポリウレタン樹脂は漏水箇所を特定し、その周囲 3 m 圏内に矩陣注入を行う「ピンポイント工法」で、低い流動性のため保護層上下の隙間や界面へは伝わりにくい伝達力の限界があります。一方ナルライトは屋上全面に 500 mm 間隔で注入孔を配置し、高い流動性と拡散力で隣接穴から原液が流出する事を確認しながら順次充填。保護層の上下・界面 全体に切れ目のない連続膜を形成するため、漏水点の特定が困難な機械室・複雑形状・複数経路の漏水でも確実に止水します。',
      diff2_stat1_v: '100%', diff2_stat1_l: '屋上面積に対する施工率',
      diff2_stat2_v: '4', diff2_stat2_l: '穴 / m²（500 mm ピッチ時）',

      diff3_no: '03',
      diff3_t: '水性 ─ 安全と環境',
      diff3_sub: '居住中の建物・室内施工が可能',
      diff3_d: '微膨張型ポリウレタン樹脂はイソシアネート系の油性ポリウレタンで、施工時には十分な換気と有機溶剤対応の保護具が必要です。ナルライトは特定化学物質・環境ホルモン・有機溶剤を一切使用しない水性材料。被膜溶出試験（JWWA 上水試験法）で水質汚染成分は不検出。居住中の集合住宅やオフィスビル、医療・教育施設の内部からの施工も可能です。',
      diff3_stat1_v: '0%', diff3_stat1_l: '有機溶剤含有量',
      diff3_stat2_v: 'JWWA', diff3_stat2_l: '上水試験法 合格',

      // Performance matrix
      perf_label: 'Performance Matrix · 性能比較',
      perf_title: '10 軸での比較',
      perf_sub: '保護防水層 全面再生という用途においては、ナルライトが優位な評価となります。',
      perf_axis: '評価軸',
      perf_better: '優位',
      perf_rows: [
        ['面再生 適性',                 25, 95, 'ナルライト'],
        ['流動性・拡散力',              30, 95, 'ナルライト'],
        ['硬化時間 現場調整',           25, 95, 'ナルライト'],
        ['長期耐久性（30 年級）',       50, 95, 'ナルライト'],
        ['微生物分解 耐性',             30, 95, 'ナルライト'],
        ['居住建物 内部施工',           20, 95, 'ナルライト'],
        ['有害物質・溶剤フリー',         25, 100, 'ナルライト'],
        ['漏水点 不特定でも対応',       30, 95, 'ナルライト'],
        ['公式技術文献・実績',           35, 95, 'ナルライト'],
        ['超細クラック（< 0.3 mm）対応', 90, 90, '同等'],
        ['産廃排出ゼロ',                70, 100, 'ナルライト'],
        ['土壌固結・水中注入',          95, 20, 'PU'],
      ],

      // Application matrix
      app_label: 'Application Fit · 用途適性',
      app_title: '正直に：それぞれが活きる現場',
      app_sub: '微膨張型ポリウレタン樹脂はクラック単点止水を、ナルライトは防水層全面再生を、それぞれ目的としています。両者は競合ではなく相補的な関係です。下記の用途別に、当社は誠実に推奨を行います。',
      app_th_scene: '現場・用途',
      app_th_ut: '微膨張型 PU',
      app_th_nl: 'ナルライト',
      app_th_winner: '推奨',
      app_rows: [
        ['屋上保護防水層の全面再生（劣化）',    1, 3, 'NL'],
        ['原因不明の漏水・複数経路の漏水',      1, 3, 'NL'],
        ['居住中の集合住宅 屋上',               1, 3, 'NL'],
        ['機械室・複雑形状の屋上',              1, 3, 'NL'],
        ['30 年 LCC を最小化したい改修',         1, 3, 'NL'],
        ['保護層上下・界面全体への確実充填',    1, 3, 'NL'],
        ['地下壁の単独クラック止水',           2, 2, 'TIE'],
        ['動水圧下のクラック緊急止水',          3, 1, 'UT'],
        ['土壌固結・地盤改良',                  3, 0, 'UT'],
        ['伸縮目地 1 本の止水',                 2, 2, 'TIE'],
        ['コンクリート躯体の構造クラック注入',  3, 1, 'UT'],
      ],

      // Footer note
      foot: '本比較は両製品の公開技術資料に基づき、当社が「保護防水層の全面再生」という用途について整理したものです。微膨張型ポリウレタン樹脂は構造クラック単点止水・土壌固結 用途においては優れた製品です。',

      legend_ut: '微膨張型 PU',
      legend_nl: 'ナルライト',
    },

    en: {
      nav: 'Compare',
      label: 'Comparative Analysis',
      title: 'Why Narulight, not Limited-Expansion Polyurethane?',
      lead: 'Limited-volume-expansion polyurethane resin is an excellent 2-part injection material for sealing individual cracks. Its low flowability, however, makes it hard to drive the resin through the full interfaces above and below the existing waterproof layer. Narulight is a water-based resin engineered specifically to spread broadly inside the protective layer and regenerate the entire deteriorated waterproof membrane. For a building-wide membrane renewal, the difference in design philosophy and long-term performance becomes decisive.',

      phil_label: 'Design Philosophy',
      phil_title: 'Same "injection," very different intent',
      phil_sub: 'Both materials are pressure-injected through the protective layer. What they aim to achieve, however, is fundamentally different.',

      ut_brand: 'Limited-expansion PU resin',
      ut_brand_sub: '2-part polyurethane injection material',
      ut_phil_t: 'Point — seals cracks one by one',
      ut_phil_d: 'Drill holes in a 30–60 cm matrix within a 3 m radius around the leak source. Low flowability limits how far the resin spreads, so it physically plugs each individual crack but does not propagate broadly above or below the existing waterproof layer.',
      ut_b1_t: 'Pitch', ut_b1_v: '300–600 mm',
      ut_b2_t: 'Spread', ut_b2_v: '⚠ Very limited flowability without pressurized injection',
      ut_b3_t: 'Fills', ut_b3_v: 'Discrete cracks & joints',
      ut_b4_t: 'Function', ut_b4_v: 'Point-source leak sealing',

      nl_brand: 'Narulight',
      nl_brand_sub: 'Water-based C5 petroleum resin emulsion',
      nl_phil_t: 'Area — forms a brand-new membrane',
      nl_phil_d: 'Drill holes in a 500 mm grid across the entire roof. Inject at ≥ 3 MPa. Outstanding flowability lets the resin spread broadly above and below the existing waterproof layer and through every interface gap, forming a continuous new waterproof membrane.',
      nl_b1_t: 'Pitch', nl_b1_v: '500 mm (standard)',
      nl_b2_t: 'Area', nl_b2_v: '100% of roof surface',
      nl_b3_t: 'Fills', nl_b3_v: 'Full inter-layer + slab cracks',
      nl_b4_t: 'Function', nl_b4_v: 'Whole-area membrane regeneration',

      diagA_pm:'Protective Mortar', diagA_sc:'Cinder Concrete', diagA_wl:'Existing WP', diagA_sl:'Slab',
      diagA_leak:'Leak point', diagA_r3:'≒ 3 m', diagA_pu:'PU point seal',
      diagB_grid:'500 × 500 mm even grid', diagB_full:'New membrane formed across the entire protective layer',

      dna_label: 'Material DNA',
      dna_title: 'Different chemistry, different fate',
      dna_sub: 'Although both are injection resins, their chemical backbone and curing mechanism are entirely different — and that determines long-term behaviour.',

      dna_ut_t: 'Limited-Expansion PU Resin',
      dna_nl_t: 'Narulight',
      dna_prop_base: 'Backbone',
      dna_prop_state: 'State',
      dna_prop_flow: 'Flowability / spread',
      dna_prop_cure: 'Cure mechanism',
      dna_prop_curetime: 'Cure-time adjustability',
      dna_prop_solids: 'Solid content',
      dna_prop_expand: 'Expansion on water contact',
      dna_prop_elong: 'Elongation at break',
      dna_prop_redis: 'Re-dissolution',
      dna_prop_micro: 'Microbial decomposition',
      dna_prop_solvent: 'Organic solvent',
      dna_prop_cleanup: 'Cleanup',
      dna_prop_record: 'Track record',

      dna_ut_base: 'Isocyanate-based 2-part polyurethane',
      dna_ut_state: 'Oil-based, 2-part reactive',
      dna_ut_flow: '⚠ Low (cone flow test ≈ 10 mm)',
      dna_ut_cure: 'Isocyanate + water reaction → foaming cure',
      dna_ut_curetime: '⚠ Fixed formulation — hard to adjust on site',
      dna_ut_visc: 'Ultra-low (< 300 cps)',
      dna_ut_solids: '100% solids',
      dna_ut_expand: '⚠ Foams & expands on water contact (closed-cell). Because water contact is virtually unavoidable in sealing injection, the expansion can impose unintended load on the surrounding protective layer.',
      dna_ut_elong: '⚠ ~50–90%',
      dna_ut_redis: 'No re-dissolution after chemical cure',
      dna_ut_micro: '⚠ Degraded by Streptomyces actinomycetes',
      dna_ut_solvent: 'Isocyanate / solvent system',
      dna_ut_cleanup: 'Requires dedicated solvent',
      dna_ut_record: '⚠ Local references only; no public/official technical literature on this application method',

      dna_nl_base: 'C5 petroleum resin (tackifier-type)',
      dna_nl_state: 'Water-based 1-part emulsion + Alofix MC',
      dna_nl_flow: '✓ Outstanding (cone flow test ≈ 49 mm / 5× farther)',
      dna_nl_cure: 'Alkali-ion reaction → coagulation gel',
      dna_nl_curetime: '✓ Adjustable on site via Alofix MC dosage (10–20%)',
      dna_nl_visc: '30,000 cps (neat) / 6,000 cps (after MC mixing)',
      dna_nl_solids: '48% (aqueous emulsion)',
      dna_nl_expand: '✓ Non-foaming, zero volume change — even after water contact, so it does not stress the protective layer',
      dna_nl_elong: '✓ Up to 160% (JIS K 6251 · ~2–3× PU)',
      dna_nl_redis: 'No re-dissolution after gel (lab-confirmed)',
      dna_nl_micro: '✓ Resistant to microbial breakdown',
      dna_nl_solvent: '0% — no hazardous substances or solvents',
      dna_nl_cleanup: 'Washes off with water',
      dna_nl_record: 'Launched 1977 · 50 yrs · public technical literature published · zero re-leak claims',

      diff_label: 'Decisive Differences',
      diff_title: 'Three decisive reasons to choose Narulight',

      diff1_no: '01',
      diff1_t: 'Resistance to microbial decomposition',
      diff1_sub: 'Will the seal still be alive in 30 years?',
      diff1_d: 'Polyurethane sealants are known to be broken down by Streptomyces actinomycetes found in soil and concrete. Once microbes consume the urethane, gaps re-open and the waterproofing fails. Narulight, built on C5 petroleum resin, resists microbial attack even inside the perpetually-damp protective layer — and has the 50-year record to prove it.',
      diff1_stat1_v: '0', diff1_stat1_l: 'Re-leak claims since 1977',
      diff1_stat2_v: '26+', diff1_stat2_l: 'years still leak-free (1997 Osaka site)',

      diff2_no: '02',
      diff2_t: 'Designed for whole-area regeneration',
      diff2_sub: 'Stops leaks even when the source cannot be found',
      diff2_d: 'Limited-expansion PU resin is a pinpoint method: locate the leak, then matrix-inject within 3 m. Its low flowability limits how far the resin spreads, so it cannot reliably reach every gap above and below the existing waterproof layer. Narulight instead lays a 500 mm grid across the entire roof and fills sequentially, confirming outflow from each adjacent hole. Its high flowability and spreading power produce an unbroken new membrane across the full inter-layer — so leaks from untraceable sources, complex geometry (machine rooms, parapets) or multiple flow paths are all reliably stopped.',
      diff2_stat1_v: '100%', diff2_stat1_l: 'of roof area treated',
      diff2_stat2_v: '4', diff2_stat2_l: 'holes / m² at 500 mm pitch',

      diff3_no: '03',
      diff3_t: 'Water-based — safe for people and planet',
      diff3_sub: 'Suitable for occupied buildings and indoor work',
      diff3_d: 'Limited-expansion PU resin is an isocyanate-based oil-borne polyurethane requiring strong ventilation and solvent-grade PPE. Narulight uses no hazardous substances, no endocrine disruptors, and no organic solvents. Coating-elution tests under the JWWA drinking-water method detected no water-pollutant components — so it is approved for occupied apartments, offices, schools, and hospitals.',
      diff3_stat1_v: '0%', diff3_stat1_l: 'organic solvent content',
      diff3_stat2_v: 'JWWA', diff3_stat2_l: 'drinking-water test passed',

      perf_label: 'Performance Matrix',
      perf_title: '10-axis side-by-side',
      perf_sub: 'For the use case of "regenerating a deteriorated protected waterproof membrane," Narulight scores higher across most axes.',
      perf_axis: 'Criterion',
      perf_better: 'Better',
      perf_rows: [
        ['Whole-area regeneration fit',         25, 95, 'NL'],
        ['Flowability / spreading power',       30, 95, 'NL'],
        ['On-site cure-time adjustability',     25, 95, 'NL'],
        ['30-year durability',                  50, 95, 'NL'],
        ['Microbial resistance',                30, 95, 'NL'],
        ['Indoor / occupied-building work',     20, 95, 'NL'],
        ['Solvent-free / non-toxic',            25, 100, 'NL'],
        ['Works with untraceable leak source',  30, 95, 'NL'],
        ['Public technical literature / record', 35, 95, 'NL'],
        ['Hairline crack (< 0.3 mm) sealing',   90, 90, 'TIE'],
        ['Zero industrial waste',               70, 100, 'NL'],
        ['Soil stabilization / sub-water',      95, 20, 'UT'],
      ],

      app_label: 'Application Fit',
      app_title: 'An honest look: where each one wins',
      app_sub: 'Limited-expansion PU resin targets discrete crack sealing; Narulight targets full-membrane regeneration. The two are complementary, not interchangeable. Our honest recommendation by scenario:',
      app_th_scene: 'Scenario',
      app_th_ut: 'Limited-exp. PU',
      app_th_nl: 'Narulight',
      app_th_winner: 'Recommended',
      app_rows: [
        ['Aged protected roof — whole-area regeneration',     1, 3, 'NL'],
        ['Unknown leak source / multi-path leaks',           1, 3, 'NL'],
        ['Occupied apartment / office rooftop',              1, 3, 'NL'],
        ['Machine rooms & complex roof geometry',            1, 3, 'NL'],
        ['Minimum 30-year life-cycle cost target',           1, 3, 'NL'],
        ['Full interface filling above & below WP layer',    1, 3, 'NL'],
        ['Single crack in basement wall',                    2, 2, 'TIE'],
        ['Emergency seal under hydrostatic pressure',        3, 1, 'UT'],
        ['Soil consolidation / ground improvement',          3, 0, 'UT'],
        ['Single expansion-joint seal',                      2, 2, 'TIE'],
        ['Structural crack injection in RC',                 3, 1, 'UT'],
      ],

      foot: 'This comparison was prepared by our team based on the public technical literature of both products, focused on the use case of "regenerating the protective waterproof layer." Limited-expansion polyurethane resin remains an excellent choice for structural crack sealing and soil stabilization.',

      legend_ut: 'Limited-exp. PU',
      legend_nl: 'Narulight',
    },

    zh: {
      nav: '比較',
      label: 'Comparative Analysis · 比較分析',
      title: '為什麼選擇 Narulight，而非 微膨脹聚氨酯樹脂？',
      lead: '微膨脹聚氨酯樹脂是優秀的雙液型灌注材，擅長單點裂縫止水。但其流動性較低，難以確實使該材透達到既有防水層上下與界面的所有隙縫。而 Narulight 是專為在保護層內部廣泛擴散、再生整片劣化防水層而設計的水性樹脂。當需要整棟建築範圍的防水更新時，兩者在設計思想與長期性能上的差距會變得決定性的。',

      phil_label: 'Design Philosophy · 設計思想',
      phil_title: '同樣是「灌注」，目標完全不同',
      phil_sub: '兩種材料都是穿透保護層加壓注入，但所欲達成的目的本質上不同。',

      ut_brand: '微膨脹聚氨酯樹脂',
      ut_brand_sub: '雙液型聚氨酯灌注材',
      ut_phil_t: '點 ── 逐條封堵裂縫',
      ut_phil_d: '以漏水點為中心，半徑 3 m 範圍內以 30〜60 cm 間距佈設鑽孔。即使加壓注入，流動性低使樹脂擴散極為受限，能物理性封堵個別裂縫，但難以在既有防水層上下與界面間廣泛傳達。',
      ut_b1_t: '孔距', ut_b1_v: '300〜600 mm',
      ut_b2_t: '擴散', ut_b2_v: '⚠ 即便加壓注入，擴散仍非常有限',
      ut_b3_t: '充填部位', ut_b3_v: '個別裂縫與伸縮縫',
      ut_b4_t: '功能', ut_b4_v: '單點漏水封堵',

      nl_brand: 'Narulight',
      nl_brand_sub: '水性 C5 系石油樹脂乳液',
      nl_phil_t: '面 ── 重新形成防水層',
      nl_phil_d: '在整片屋頂以 500 mm 等間距布孔，以 ≥ 3 MPa 壓力注入。優越的流動性使樹脂在既有防水層的上下與界面 之間廣泛擴散，形成連續的全新防水膜。',
      nl_b1_t: '孔距', nl_b1_v: '500 mm（標準）',
      nl_b2_t: '施作範圍', nl_b2_v: '屋頂全面（100%）',
      nl_b3_t: '充填部位', nl_b3_v: '保護層／防水層／樓板 全層',
      nl_b4_t: '功能', nl_b4_v: '防水層 全面再生',

      diagA_pm:'保護砂漿', diagA_sc:'煤渣混凝土', diagA_wl:'既有防水層', diagA_sl:'樓板',
      diagA_leak:'漏水點', diagA_r3:'≒ 3 m', diagA_pu:'PU 單點止水',
      diagB_grid:'500 × 500 mm 等間距', diagB_full:'在保護層內部形成全新防水層',

      dna_label: 'Material DNA · 材料 DNA',
      dna_title: '化學 DNA 的差異',
      dna_sub: '雖然都是灌注樹脂，但化學骨架與硬化機制完全不同 ── 這決定了長期表現。',

      dna_ut_t: '微膨脹聚氨酯樹脂',
      dna_nl_t: 'Narulight',
      dna_prop_base: '主成分',
      dna_prop_state: '型態',
      dna_prop_flow: '流動性／擴散力',
      dna_prop_cure: '硬化機制',
      dna_prop_curetime: '硬化時間 調整',
      dna_prop_solids: '固形含量',
      dna_prop_expand: '水接觸時的膨脹',
      dna_prop_elong: '斷裂伸長率',
      dna_prop_redis: '再溶解',
      dna_prop_micro: '微生物分解',
      dna_prop_solvent: '有機溶劑',
      dna_prop_cleanup: '清洗方式',
      dna_prop_record: '實績',

      dna_ut_base: '異氰酸酯系雙液型聚氨酯',
      dna_ut_state: '油性 雙液反應型',
      dna_ut_flow: '⚠ 低（錐筒流動試驗 ≒ 10 mm）',
      dna_ut_cure: '異氰酸酯遇水反應 → 發泡硬化',
      dna_ut_curetime: '⚠ 配方固定，現場難以調整',
      dna_ut_visc: '超低黏度（< 300 cps）',
      dna_ut_solids: '100% 固形含量',
      dna_ut_expand: '⚠ 遇水發泡膨脹（閉孔結構）。於密封注入現場接觸水分幾乎無可避免，膨脹會對保護層產生非預期負荷',
      dna_ut_elong: '⚠ 約 50〜90%',
      dna_ut_redis: '化學硬化後不再溶解',
      dna_ut_micro: '⚠ 受放線菌（Streptomyces）分解',
      dna_ut_solvent: '異氰酸酯／溶劑系',
      dna_ut_cleanup: '需專用溶劑清洗',
      dna_ut_record: '⚠ 僅有各地區個別採用實績；針對本工法尚無公開正式的技術文獻',

      dna_nl_base: 'C5 系石油樹脂（粘著賦予劑）',
      dna_nl_state: '水性單液型乳液 + AlofixMC',
      dna_nl_flow: '✓ 卓越（錐筒流動試驗 ≒ 49 mm／5 倍）',
      dna_nl_cure: '鹼金屬離子反應 → 凝集膠化',
      dna_nl_curetime: '✓ 可依 MC 混入量 10〜20% 於現場調整',
      dna_nl_visc: '30,000 cps（原液）／6,000 cps（混入 MC 後）',
      dna_nl_solids: '48%（水性乳液）',
      dna_nl_expand: '✓ 無發泡、無體積變化。即使接觸水分也不膨脹，不會對保護層產生額外負荷',
      dna_nl_elong: '✓ 160%（JIS K 6251，約為 PU 之 2〜3 倍）',
      dna_nl_redis: '膠化後完全不再溶解（試驗確認）',
      dna_nl_micro: '✓ 不易受微生物分解',
      dna_nl_solvent: '0% ── 無有害物質與有機溶劑',
      dna_nl_cleanup: '可用清水清洗',
      dna_nl_record: '1977 年發售以來 50 年 · 公開技術文獻齊備 · 再漏水申訴零件',

      diff_label: 'Decisive Differences · 決定性差異',
      diff_title: 'Narulight 被選擇的三項決定性理由',

      diff1_no: '01',
      diff1_t: '對微生物分解的耐性',
      diff1_sub: '30 年後仍「活著」的防水層',
      diff1_d: 'PU 聚氨酯系止水材已知會被土壤與混凝土中棲息的放線菌（Streptomyces 屬）分解。被微生物啃食的聚氨酯產生孔隙，長期之下喪失止水性能。Narulight 以石油樹脂為主成分，即使位於潮濕的保護層內部也不易被微生物分解，並擁有將近 50 年的實績佐證。',
      diff1_stat1_v: '0', diff1_stat1_l: '再漏水申訴件數（1977〜現今）',
      diff1_stat2_v: '26+', diff1_stat2_l: '年仍未漏水 確認實例（1997 大阪施工）',

      diff2_no: '02',
      diff2_t: '為「面再生」而設計',
      diff2_sub: '即使漏水點無法特定也能完全止水',
      diff2_d: '微膨脹聚氨酯樹脂是針對已知漏水點，在 3 m 半徑內進行矩陣灌注的「點工法」。低流動性使其難以在既有防水層上下與界面間充分透達。Narulight 則在整片屋頂以 500 mm 間距布孔，依序確認相鄰孔出液後逐孔填補。高流動性與擴散力使其在保護層上下與界面全面形成不間斷的連續新膜 ── 即使漏水源頭難以追查、機械室與屋頂幾何複雜、或存在多條漏水路徑，皆能可靠止水。',
      diff2_stat1_v: '100%', diff2_stat1_l: '屋頂面積施作覆蓋率',
      diff2_stat2_v: '4', diff2_stat2_l: '孔 / m²（500 mm 間距）',

      diff3_no: '03',
      diff3_t: '水性 ─ 對人對地球都安全',
      diff3_sub: '可於住戶仍居住之建築與室內施作',
      diff3_d: '微膨脹聚氨酯樹脂為異氰酸酯油性聚氨酯，施作時需要充分通風與耐溶劑防護裝備。Narulight 完全不使用有害化學物質、環境荷爾蒙與有機溶劑。塗膜溶出試驗（JWWA 上水試驗法）未檢出水質污染成分 ── 可於住戶在住的公寓、辦公大樓、學校、醫療設施內部進行施工。',
      diff3_stat1_v: '0%', diff3_stat1_l: '有機溶劑含量',
      diff3_stat2_v: 'JWWA', diff3_stat2_l: '上水試驗法 通過',

      perf_label: 'Performance Matrix · 性能比較',
      perf_title: '10 項評估軸',
      perf_sub: '在「全面再生既有保護防水層」的用途中，Narulight 在大多數評估項目上居於優勢。',
      perf_axis: '評估項目',
      perf_better: '優勢',
      perf_rows: [
        ['面再生 適性',                     25, 95, 'NL'],
        ['流動性・擴散力',                  30, 95, 'NL'],
        ['硬化時間 現場調整',               25, 95, 'NL'],
        ['長期耐久性（30 年級）',           50, 95, 'NL'],
        ['微生物分解 耐性',                 30, 95, 'NL'],
        ['住戶在住建築 室內施作',           20, 95, 'NL'],
        ['無有害物質・溶劑',                 25, 100, 'NL'],
        ['漏水點不明 之對應',               30, 95, 'NL'],
        ['公開技術文獻・實績',               35, 95, 'NL'],
        ['髮絲裂縫（< 0.3 mm）封堵',         90, 90, 'TIE'],
        ['零產業廢棄物',                    70, 100, 'NL'],
        ['地盤固結・水中灌注',              95, 20, 'UT'],
      ],

      app_label: 'Application Fit · 用途適性',
      app_title: '誠實對照：各自的最佳場景',
      app_sub: '微膨脹聚氨酯樹脂以單點裂縫止水為目的、Narulight 以防水層全面再生為目的。兩者為相輔相成而非競爭關係。依用途，我們的誠實推薦如下：',
      app_th_scene: '場景・用途',
      app_th_ut: '微膨脹 PU',
      app_th_nl: 'Narulight',
      app_th_winner: '推薦',
      app_rows: [
        ['屋頂保護防水層的全面再生（老化）',  1, 3, 'NL'],
        ['漏水原因不明・多路徑漏水',          1, 3, 'NL'],
        ['住戶在住的集合住宅 屋頂',           1, 3, 'NL'],
        ['機械室・幾何複雜的屋頂',            1, 3, 'NL'],
        ['追求 30 年 LCC 最小化的整修',        1, 3, 'NL'],
        ['防水層上下・界面全面確實填充',    1, 3, 'NL'],
        ['地下室牆面 單一裂縫止水',           2, 2, 'TIE'],
        ['動水壓下的裂縫緊急止水',            3, 1, 'UT'],
        ['地盤固結・土壤改良',                3, 0, 'UT'],
        ['單一伸縮縫止水',                    2, 2, 'TIE'],
        ['RC 構造性裂縫灌注',                 3, 1, 'UT'],
      ],

      foot: '本比較係根據兩產品之公開技術資料、針對「保護防水層全面再生」用途整理而成。微膨脹聚氨酯樹脂於構造性裂縫單點止水、地盤固結等用途仍為優秀的選擇。',

      legend_ut: '微膨脹 PU',
      legend_nl: 'Narulight',
    },
  };

  // ====== HELPERS ======
  function getLang(){
    const l = document.documentElement.lang;
    if (l === 'en') return 'en';
    if (l === 'zh-TW' || l === 'zh') return 'zh';
    return 'ja';
  }
  function L(k){ return T[getLang()][k]; }

  // ====== STYLES ======
  const styles = `
    #comparison { background: linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%); border-top: 1px solid var(--border); }
    #comparison .cmp-lead { font-size: 16px; color: var(--text); line-height: 1.85; max-width: 900px; margin: 8px 0 0; opacity: .9; }
    html[data-theme="light"] #comparison .cmp-lead { color: var(--text); opacity: 1; }

    .cmp-subhead { margin: 80px 0 28px; }
    .cmp-subhead .section-label { color: var(--accent); }

    /* === TWO PHILOSOPHIES === */
    .cmp-phil { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px; }
    .cmp-phil-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 28px; position: relative; overflow: hidden; }
    .cmp-phil-card.ut::before, .cmp-phil-card.nl::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .cmp-phil-card.ut::before { background: linear-gradient(90deg, #ff8a3d, transparent); }
    .cmp-phil-card.nl::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
    .cmp-brand-row { display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px; flex-wrap: wrap; }
    .cmp-brand { font-family: 'Barlow Condensed', sans-serif; font-size: 30px; font-weight: 800; letter-spacing: 1px; }
    .cmp-phil-card.ut .cmp-brand { color: #ff8a3d; }
    .cmp-phil-card.nl .cmp-brand { color: var(--accent); }
    .cmp-brand-sub { font-size: 13px; color: var(--sub); letter-spacing: .5px; }
    .cmp-phil-h { font-size: 19px; font-weight: 700; color: var(--white); margin: 22px 0 10px; line-height: 1.35; }
    html[data-theme="light"] .cmp-phil-h { color: var(--text); }
    .cmp-phil-d { font-size: 13.5px; color: var(--sub); line-height: 1.75; }
    .cmp-phil-svg { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; margin: 22px 0 22px; aspect-ratio: 16/9; }
    .cmp-phil-svg svg { width: 100%; height: 100%; display: block; }
    .cmp-bullets { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; margin-top: 18px; }
    .cmp-bullet { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; border-top: 1px solid var(--border); }
    .cmp-bullet-k { font-size: 11px; color: var(--sub); letter-spacing: 1px; text-transform: uppercase; font-family: 'Barlow Condensed', sans-serif; }
    .cmp-bullet-v { font-size: 14px; color: var(--text); font-weight: 600; }
    html[data-theme="light"] .cmp-bullet-v { color: var(--text); }

    /* === MATERIAL DNA === */
    .cmp-dna { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 0; margin-top: 32px; overflow: hidden; }
    .cmp-dna-head { display: grid; grid-template-columns: 1.1fr 1fr 1fr; background: var(--card2); border-bottom: 1px solid var(--border); }
    .cmp-dna-h-cell { padding: 22px 24px; font-family: 'Barlow Condensed', sans-serif; }
    .cmp-dna-h-cell:first-child { color: var(--sub); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; display: flex; align-items: center; }
    .cmp-dna-h-cell.ut, .cmp-dna-h-cell.nl { border-left: 1px solid var(--border); }
    .cmp-dna-h-brand { font-size: 24px; font-weight: 800; letter-spacing: 1px; }
    .cmp-dna-h-cell.ut .cmp-dna-h-brand { color: #ff8a3d; }
    .cmp-dna-h-cell.nl .cmp-dna-h-brand { color: var(--accent); }
    .cmp-dna-row { display: grid; grid-template-columns: 1.1fr 1fr 1fr; border-bottom: 1px solid var(--border); }
    .cmp-dna-row:last-child { border-bottom: none; }
    .cmp-dna-cell { padding: 16px 24px; font-size: 13.5px; line-height: 1.55; }
    .cmp-dna-cell.k { color: var(--sub); font-weight: 500; background: rgba(0,0,0,0.07); }
    html[data-theme="light"] .cmp-dna-cell.k { background: rgba(0,0,0,0.025); }
    .cmp-dna-cell.v { color: var(--text); border-left: 1px solid var(--border); }
    .cmp-dna-cell.v.warn { color: #ff9456; font-weight: 600; }
    html[data-theme="light"] .cmp-dna-cell.v.warn { color: #c75300; }
    .cmp-dna-cell.v.good { color: var(--accent2); font-weight: 600; }

    /* === 3 DIFFERENTIATORS === */
    .cmp-diffs { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 32px; }
    .cmp-diff { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 0; display: grid; grid-template-columns: 1fr 1.2fr; overflow: hidden; }
    .cmp-diff-art { background: var(--surface); border-right: 1px solid var(--border); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 280px; }
    .cmp-diff-art svg { width: 100%; height: auto; max-width: 480px; display: block; }
    .cmp-diff-body { padding: 36px 40px; }
    .cmp-diff-no { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: var(--accent); letter-spacing: 4px; font-weight: 700; }
    .cmp-diff-t { font-family: 'Barlow Condensed', sans-serif; font-size: 30px; font-weight: 700; color: var(--white); line-height: 1.15; margin: 8px 0 6px; }
    html[data-theme="light"] .cmp-diff-t { color: var(--text); }
    .cmp-diff-sub { font-size: 14px; color: var(--accent); font-weight: 600; margin-bottom: 16px; letter-spacing: .5px; }
    .cmp-diff-d { font-size: 14px; color: var(--text); line-height: 1.85; opacity: .9; }
    html[data-theme="light"] .cmp-diff-d { opacity: 1; color: var(--text); }
    .cmp-diff-stats { display: flex; gap: 36px; margin-top: 22px; }
    .cmp-diff-stat { border-left: 2px solid var(--accent); padding-left: 16px; }
    .cmp-diff-stat-v { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 800; color: var(--white); line-height: 1; }
    html[data-theme="light"] .cmp-diff-stat-v { color: var(--accent); }
    .cmp-diff-stat-l { font-size: 11px; color: var(--sub); letter-spacing: 1px; margin-top: 4px; line-height: 1.4; max-width: 180px; }

    /* === PERFORMANCE MATRIX === */
    .cmp-perf { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 32px 36px; margin-top: 32px; }
    .cmp-perf-legend { display: flex; gap: 24px; margin-bottom: 22px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 1px; }
    .cmp-perf-legend .swatch { display: inline-flex; align-items: center; gap: 8px; }
    .cmp-perf-legend .dot { width: 14px; height: 14px; border-radius: 50%; }
    .cmp-perf-legend .dot.ut { background: #ff8a3d; }
    .cmp-perf-legend .dot.nl { background: var(--accent); }
    .cmp-perf-table { width: 100%; border-collapse: collapse; }
    .cmp-perf-row { display: grid; grid-template-columns: 240px 1fr 1fr 80px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border); gap: 16px; }
    .cmp-perf-row:last-child { border-bottom: none; }
    .cmp-perf-axis { font-size: 13.5px; color: var(--text); font-weight: 500; }
    .cmp-perf-bar { height: 12px; background: rgba(255,255,255,0.04); border-radius: 6px; overflow: hidden; position: relative; }
    html[data-theme="light"] .cmp-perf-bar { background: rgba(0,0,0,0.05); }
    .cmp-perf-bar .fill { height: 100%; border-radius: 6px; transition: width 1.1s cubic-bezier(.17,.67,.37,1.1); }
    .cmp-perf-bar.ut .fill { background: linear-gradient(90deg, #ff8a3d, #ffb86b); }
    .cmp-perf-bar.nl .fill { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
    .cmp-perf-bar .val { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--white); font-weight: 700; }
    html[data-theme="light"] .cmp-perf-bar .val { color: var(--text); }
    .cmp-perf-win { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 1px; text-align: right; font-weight: 700; text-transform: uppercase; }
    .cmp-perf-win.win-ut { color: #ff8a3d; }
    .cmp-perf-win.win-nl { color: var(--accent); }
    .cmp-perf-win.win-tie { color: var(--sub); }
    .cmp-perf-row .col-h { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--sub); letter-spacing: 1px; text-transform: uppercase; }

    /* === APPLICATION MATRIX === */
    .cmp-app { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-top: 32px; }
    .cmp-app table { width: 100%; border-collapse: collapse; }
    .cmp-app th, .cmp-app td { padding: 14px 22px; text-align: left; font-size: 14px; border-bottom: 1px solid var(--border); }
    .cmp-app th { color: var(--sub); font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; background: var(--card2); }
    .cmp-app td { color: var(--text); }
    .cmp-app th.center, .cmp-app td.center { text-align: center; }
    .cmp-app .rating { display: inline-flex; gap: 2px; }
    .cmp-app .star { font-size: 16px; line-height: 1; }
    .cmp-app .star.on.ut { color: #ff8a3d; }
    .cmp-app .star.on.nl { color: var(--accent); }
    .cmp-app .star.off { color: rgba(120,140,170,0.25); }
    .cmp-app .winner { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 4px; letter-spacing: 1px; }
    .cmp-app .winner.nl { background: rgba(0,196,255,0.14); color: var(--accent); }
    .cmp-app .winner.ut { background: rgba(255,138,61,0.15); color: #ff8a3d; }
    .cmp-app tr:last-child td { border-bottom: none; }

    .cmp-foot { font-size: 12px; color: var(--sub); line-height: 1.8; margin-top: 24px; padding: 18px 22px; border: 1px dashed var(--border); border-radius: 8px; }

    /* ====== LIGHT-MODE SVG OVERRIDES (Philosophy + Differentiator art) ====== */
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#1a2840"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#1a2840"] { fill: #e4e8ee; stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#162035"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#162035"] { fill: #d8dde6; stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#0f2840"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#0f2840"] { fill: #d6eaf5; stroke: #0a7fb8; }
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#0d1525"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#0d1525"] { fill: #cdd2d9; stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#07101e"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#07101e"] { fill: #ffffff; stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg rect[fill="#0a1525"],
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#0a1525"] { fill: #f0f3f7; stroke: #9aa4b4; }

    /* Text inside SVGs */
    html[data-theme="light"] .cmp-phil-svg svg text[fill="#8aaac8"],
    html[data-theme="light"] .cmp-diff-art svg text[fill="#8aaac8"] { fill: #1f2a3a; font-weight: 600; }
    html[data-theme="light"] .cmp-phil-svg svg text[fill="#9aa8b8"],
    html[data-theme="light"] .cmp-diff-art svg text[fill="#9aa8b8"] { fill: #3a4252; }
    html[data-theme="light"] .cmp-phil-svg svg text[fill="#5a7090"],
    html[data-theme="light"] .cmp-diff-art svg text[fill="#5a7090"] { fill: #525a68; }
    html[data-theme="light"] .cmp-phil-svg svg text[fill="#3a5070"],
    html[data-theme="light"] .cmp-diff-art svg text[fill="#3a5070"] { fill: #525a68; }

    /* Strokes (dimension brackets, frames) */
    html[data-theme="light"] .cmp-phil-svg svg line[stroke="#2a4060"],
    html[data-theme="light"] .cmp-diff-art svg line[stroke="#2a4060"] { stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg line[stroke="#3a5070"],
    html[data-theme="light"] .cmp-diff-art svg line[stroke="#3a5070"] { stroke: #b8c0cc; }
    html[data-theme="light"] .cmp-phil-svg svg path[stroke="#0d1a2e"],
    html[data-theme="light"] .cmp-diff-art svg path[stroke="#0d1a2e"] { stroke: #2a2a35; }
    html[data-theme="light"] .cmp-phil-svg svg path[stroke="#0a1520"],
    html[data-theme="light"] .cmp-diff-art svg path[stroke="#0a1520"] { stroke: #2a2a35; }

    /* Misc decorative */
    html[data-theme="light"] .cmp-phil-svg svg circle[fill="#0066aa"],
    html[data-theme="light"] .cmp-diff-art svg circle[fill="#0066aa"] { fill: #4070a0; }
    html[data-theme="light"] .cmp-diff-art svg ellipse[fill="#1a3a1a"] { fill: #c8e0c8; }
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#7a3c12"] { fill: #c97a3d; }
    html[data-theme="light"] .cmp-diff-art svg ellipse[fill="#a05010"] { fill: #d18a4a; }
    html[data-theme="light"] .cmp-diff-art svg rect[fill="#888"] { fill: #6a7180; }

    /* Stage backgrounds */
    html[data-theme="light"] .cmp-phil-svg { background: #ffffff; }
    html[data-theme="light"] .cmp-diff-art { background: #fbfbfd; }

    /* ====== RESPONSIVE: desktop / tablet / mobile ====== */
    @media (max-width: 1180px) {
      .cmp-phil-card { padding: 24px; }
      .cmp-diff-body { padding: 30px 32px; }
      .cmp-perf-row { grid-template-columns: 200px 1fr 1fr 72px; gap: 12px; }
      .cmp-diff-t { font-size: 26px; }
    }

    /* Tablet — stack the two-column layouts */
    @media (max-width: 900px){
      .cmp-phil { grid-template-columns: 1fr; gap: 16px; }
      .cmp-phil-card { padding: 22px; border-radius: 12px; }
      .cmp-phil-svg { margin: 18px 0; }
      .cmp-bullets { gap: 6px 14px; }

      .cmp-diff { grid-template-columns: 1fr; border-radius: 12px; }
      .cmp-diff-art { border-right: none; border-bottom: 1px solid var(--border); min-height: 200px; padding: 24px; }
      .cmp-diff-body { padding: 28px 26px; }
      .cmp-diff-t { font-size: 24px; }
      .cmp-diff-stats { gap: 28px; }
      .cmp-diff-stat-v { font-size: 32px; }

      .cmp-dna-head, .cmp-dna-row { grid-template-columns: 1fr 1fr; }
      .cmp-dna-h-cell:first-child { display: none; }
      .cmp-dna-cell.k { grid-column: 1 / -1; padding: 12px 22px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; background: rgba(0,0,0,0.18); }
      html[data-theme="light"] .cmp-dna-cell.k { background: rgba(0,0,0,0.04); }
      .cmp-dna-cell { padding: 14px 20px; font-size: 13px; }

      .cmp-perf { padding: 26px 22px; }
      .cmp-perf-row { grid-template-columns: 1fr 1fr; gap: 6px 14px; padding: 14px 0; }
      .cmp-perf-axis { grid-column: 1 / -1; margin-bottom: 4px; font-size: 13px; font-weight: 600; color: var(--text); }
      .cmp-perf-win { grid-column: 1 / -1; text-align: left; padding-top: 6px; font-size: 10px; letter-spacing: 1.5px; }
      .cmp-perf-row .col-h { font-size: 10px; }

      /* Application table — allow horizontal scroll if cramped */
      .cmp-app { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .cmp-app table { min-width: 520px; }
      .cmp-app th, .cmp-app td { padding: 10px 12px; font-size: 12px; }
      .cmp-subhead { margin-top: 64px; }
    }

    /* Mobile */
    @media (max-width: 640px) {
      .cmp-lead { font-size: 14.5px; line-height: 1.75; }
      .cmp-subhead { margin-top: 52px; margin-bottom: 22px; }

      .cmp-phil-card { padding: 18px 16px; border-radius: 10px; }
      .cmp-brand { font-size: 22px; }
      .cmp-brand-sub { font-size: 12px; }
      .cmp-phil-h { font-size: 16px; margin: 18px 0 8px; }
      .cmp-phil-d { font-size: 13px; line-height: 1.7; }
      .cmp-bullets { grid-template-columns: 1fr; gap: 0; }
      .cmp-bullet { padding: 8px 0; }
      .cmp-bullet-v { font-size: 13px; }

      .cmp-diff { border-radius: 10px; }
      .cmp-diff-art { padding: 18px; min-height: 160px; }
      .cmp-diff-body { padding: 22px 18px; }
      .cmp-diff-no { font-size: 12px; letter-spacing: 3px; }
      .cmp-diff-t { font-size: 21px; }
      .cmp-diff-sub { font-size: 13px; }
      .cmp-diff-d { font-size: 13.5px; line-height: 1.75; }
      .cmp-diff-stats { gap: 18px; flex-wrap: wrap; margin-top: 18px; }
      .cmp-diff-stat-v { font-size: 26px; }
      .cmp-diff-stat-l { font-size: 10px; letter-spacing: .5px; max-width: 140px; }

      .cmp-dna { border-radius: 10px; }
      .cmp-dna-h-cell { padding: 16px 18px; }
      .cmp-dna-h-brand { font-size: 18px; }
      .cmp-dna-cell { padding: 12px 16px; font-size: 12.5px; }
      .cmp-dna-cell.k { padding: 10px 16px; }

      .cmp-perf { padding: 20px 16px; border-radius: 10px; }
      .cmp-perf-bar { height: 10px; }
      .cmp-perf-bar .val { font-size: 9px; right: 6px; }
      .cmp-perf-axis { font-size: 12.5px; }
      .cmp-perf-legend { gap: 16px; font-size: 12px; margin-bottom: 16px; }
      .cmp-perf-legend .dot { width: 12px; height: 12px; }

      .cmp-app { border-radius: 10px; }
      .cmp-app table { min-width: 460px; }
      .cmp-app th, .cmp-app td { padding: 9px 10px; font-size: 11.5px; }
      .cmp-app .star { font-size: 14px; }
      .cmp-app .winner { font-size: 11px; padding: 3px 8px; }

      .cmp-foot { font-size: 11.5px; padding: 14px 16px; }
    }

    /* Small phones */
    @media (max-width: 420px) {
      .cmp-phil-card { padding: 16px 14px; }
      .cmp-phil-svg { margin: 14px 0; border-radius: 6px; }
      .cmp-diff-body { padding: 20px 14px; }
      .cmp-diff-t { font-size: 19px; }
      .cmp-diff-stats { gap: 14px; }
      .cmp-diff-stat-v { font-size: 24px; }
      .cmp-dna-cell { padding: 10px 12px; font-size: 12px; }
      .cmp-perf { padding: 16px 12px; }
      .cmp-app th, .cmp-app td { padding: 8px 8px; }
      .cmp-perf-row { padding: 12px 0; }
    }
  `;

  // ====== SVG DIAGRAMS ======
  // Diagram A: UT-230 — Point repair on one leak source
  function svgUT(){
    const t = T[getLang()];
    return `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ut-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#ff8a3d" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#ff8a3d" stop-opacity="0.15"/>
          </linearGradient>
        </defs>
        <rect width="600" height="320" fill="transparent"/>
        <!-- Roof stack -->
        <rect x="30" y="40"  width="540" height="22" fill="#1a2840" stroke="#2a4060"/>
        <text x="42" y="56" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_pm}</text>
        <rect x="30" y="62"  width="540" height="74" fill="#162035" stroke="#2a4060"/>
        <text x="42" y="103" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_sc}</text>
        <rect x="30" y="136" width="540" height="16" fill="#0f2840" stroke="#00c4ff" stroke-dasharray="4 2" stroke-width="1"/>
        <text x="42" y="148" fill="#00c4ff" font-size="9" font-family="Barlow Condensed">${t.diagA_wl}</text>
        <rect x="30" y="152" width="540" height="80" fill="#0d1525" stroke="#2a4060"/>
        <text x="42" y="200" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_sl}</text>
        <rect x="30" y="232" width="540" height="20" fill="#07101e" stroke="#2a4060"/>

        <!-- Leak point at center, drip downward through slab -->
        <path d="M300 62 L298 96 L304 118 L300 136 L304 152 L302 220" stroke="#0a1520" stroke-width="2.2" fill="none"/>

        <!-- Crack at the leak point (highlighted with PU fill) -->
        <path d="M300 62 L298 96 L304 118 L300 136 L304 152 L302 220" stroke="#ff8a3d" stroke-width="3" fill="none" opacity="0.7"/>

        <!-- Drip below crack -->
        <ellipse cx="302" cy="240" rx="5" ry="6" fill="#0066aa" opacity="0.7"/>
        <text x="312" y="244" fill="#0066aa" font-size="10" font-family="Barlow Condensed">${t.diagA_leak}</text>

        <!-- 3 m radius matrix arc -->
        <line x1="210" y1="40" x2="210" y2="62" stroke="#ff8a3d" stroke-width="1" stroke-dasharray="3 2"/>
        <line x1="390" y1="40" x2="390" y2="62" stroke="#ff8a3d" stroke-width="1" stroke-dasharray="3 2"/>
        <line x1="210" y1="28" x2="390" y2="28" stroke="#ff8a3d" stroke-width="1.2"/>
        <line x1="210" y1="24" x2="210" y2="32" stroke="#ff8a3d" stroke-width="1.2"/>
        <line x1="390" y1="24" x2="390" y2="32" stroke="#ff8a3d" stroke-width="1.2"/>
        <text x="300" y="22" fill="#ff8a3d" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${t.diagA_r3}</text>

        <!-- 5 drill holes in matrix around center -->
        ${[225, 263, 300, 337, 375].map(x => `
          <rect x="${x-4}" y="32" width="8" height="${x===300?10:8}" rx="1" fill="#ff8a3d"/>
          <line x1="${x}" y1="42" x2="${x}" y2="138" stroke="#ff8a3d" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.6"/>
          <circle cx="${x}" cy="135" r="3" fill="url(#ut-grad)" stroke="#ff8a3d" stroke-width="0.8"/>
        `).join('')}

        <!-- PU foam highlight around leak crack -->
        <ellipse cx="302" cy="100" rx="40" ry="34" fill="url(#ut-grad)" opacity="0.55"/>
        <ellipse cx="302" cy="100" rx="40" ry="34" fill="none" stroke="#ff8a3d" stroke-width="0.8" stroke-dasharray="2 2"/>
        <text x="302" y="280" fill="#ff8a3d" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${t.diagA_pu}</text>

        <!-- Outer roof bounds indicator -->
        <line x1="30" y1="290" x2="570" y2="290" stroke="#3a5070" stroke-width="0.8"/>
        <line x1="30" y1="286" x2="30" y2="294" stroke="#3a5070" stroke-width="0.8"/>
        <line x1="570" y1="286" x2="570" y2="294" stroke="#3a5070" stroke-width="0.8"/>
        <text x="300" y="306" fill="#5a7090" font-size="10" font-family="Barlow Condensed" text-anchor="middle">${getLang()==='ja'?'屋上全幅':getLang()==='zh'?'屋頂全寬':'Full roof width'}</text>
      </svg>
    `;
  }

  // Diagram B: Narulight — Whole area regeneration
  function svgNL(){
    const t = T[getLang()];
    const xs = [60, 130, 200, 270, 340, 410, 480, 550];
    return `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="nl-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#00c4ff" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#00e5a8" stop-opacity="0.3"/>
          </linearGradient>
        </defs>
        <rect width="600" height="320" fill="transparent"/>
        <!-- Roof stack -->
        <rect x="30" y="40"  width="540" height="22" fill="#1a2840" stroke="#2a4060"/>
        <text x="42" y="56" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_pm}</text>
        <rect x="30" y="62"  width="540" height="74" fill="#162035" stroke="#2a4060"/>
        <text x="42" y="103" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_sc}</text>
        <rect x="30" y="136" width="540" height="16" fill="#0f2840" stroke="#00c4ff" stroke-dasharray="4 2" stroke-width="1"/>
        <text x="42" y="148" fill="#00c4ff" font-size="9" font-family="Barlow Condensed">${t.diagA_wl}</text>
        <rect x="30" y="152" width="540" height="80" fill="#0d1525" stroke="#2a4060"/>
        <text x="42" y="200" fill="#8aaac8" font-size="10" font-family="Barlow Condensed">${t.diagA_sl}</text>
        <rect x="30" y="232" width="540" height="20" fill="#07101e" stroke="#2a4060"/>

        <!-- Continuous Narulight fill at WP interlayer (full width!) -->
        <rect x="30" y="128" width="540" height="26" fill="url(#nl-grad)" stroke="#00c4ff" stroke-width="0.8"/>
        <!-- Subtle fill in cracks -->
        ${[100, 240, 380, 500].map(x => `<path d="M${x} 62 L${x-3} ${100} L${x+4} ${130}" stroke="#00c4ff" stroke-width="2.2" opacity="0.7" fill="none"/>`).join('')}
        <!-- Fill in slab cracks -->
        ${[160, 320, 450].map(x => `<path d="M${x} 152 L${x-3} ${180} L${x+4} ${210}" stroke="#00c4ff" stroke-width="1.8" opacity="0.55" fill="none"/>`).join('')}

        <!-- Even 500mm pitch drill holes -->
        ${xs.map(x => `
          <rect x="${x-3}" y="32" width="6" height="9" rx="1" fill="#00c4ff"/>
          <line x1="${x}" y1="42" x2="${x}" y2="135" stroke="#00c4ff" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
        `).join('')}

        <!-- Pitch dimension -->
        <line x1="${xs[2]}" y1="22" x2="${xs[3]}" y2="22" stroke="#00c4ff" stroke-width="1.2"/>
        <line x1="${xs[2]}" y1="18" x2="${xs[2]}" y2="26" stroke="#00c4ff" stroke-width="1.2"/>
        <line x1="${xs[3]}" y1="18" x2="${xs[3]}" y2="26" stroke="#00c4ff" stroke-width="1.2"/>
        <text x="${(xs[2]+xs[3])/2}" y="16" fill="#00c4ff" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${t.diagB_grid}</text>

        <text x="300" y="280" fill="#00c4ff" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${t.diagB_full}</text>

        <!-- Outer roof bounds indicator -->
        <line x1="30" y1="290" x2="570" y2="290" stroke="#3a5070" stroke-width="0.8"/>
        <line x1="30" y1="286" x2="30" y2="294" stroke="#3a5070" stroke-width="0.8"/>
        <line x1="570" y1="286" x2="570" y2="294" stroke="#3a5070" stroke-width="0.8"/>
        <text x="300" y="306" fill="#5a7090" font-size="10" font-family="Barlow Condensed" text-anchor="middle">${getLang()==='ja'?'屋上全幅':getLang()==='zh'?'屋頂全寬':'Full roof width'}</text>
      </svg>
    `;
  }

  // Diagram: Microbial degradation
  function svgMicro(){
    const lang = getLang();
    const utLabel = lang==='ja'?'放線菌が分解': lang==='zh'?'放線菌分解':'Microbes degrade';
    const nlLabel = lang==='ja'?'微生物が分解できない': lang==='zh'?'微生物無法分解':'Microbes rejected';
    const utChain = lang==='ja'?'ポリウレタン':lang==='zh'?'聚氨酯':'Polyurethane';
    const nlChain = lang==='ja'?'C5 石油樹脂':lang==='zh'?'C5 石油樹脂':'C5 petroleum resin';
    const yr30 = lang==='ja'?'30 年後':lang==='zh'?'30 年後':'After 30 years';
    return `
      <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="260" fill="transparent"/>
        <!-- LEFT: PU chain being eaten -->
        <text x="120" y="22" fill="#ff8a3d" font-size="11" font-family="Barlow Condensed" font-weight="700" text-anchor="middle">${T[getLang()].legend_ut} · ${utChain}</text>

        <!-- Top: intact-ish chain with gaps appearing -->
        <g transform="translate(20,52)">
          ${[0,1,2,3,4,5].map(i => {
            const broken = (i===1 || i===3);
            return `
              <circle cx="${i*30+15}" cy="14" r="9" fill="${broken?'rgba(255,138,61,0.25)':'rgba(255,138,61,0.9)'}" stroke="${broken?'#ff8a3d':'none'}" stroke-dasharray="${broken?'2 1':''}"/>
              ${i<5 ? `<line x1="${i*30+24}" y1="14" x2="${(i+1)*30+6}" y2="14" stroke="${broken?'rgba(255,138,61,0.3)':'#ff8a3d'}" stroke-width="${broken?1:3}" stroke-dasharray="${broken?'2 2':''}"/>` : ''}
            `;
          }).join('')}
        </g>
        <!-- Streptomyces microbes -->
        <g transform="translate(20,82)">
          ${[35, 95, 155].map(x => `
            <g transform="translate(${x},0)">
              <ellipse cx="0" cy="0" rx="6" ry="4" fill="#1a3a1a" stroke="#3ce000" stroke-width="0.8" opacity="0.85"/>
              <line x1="-7" y1="-2" x2="-10" y2="-5" stroke="#3ce000" stroke-width="0.6"/>
              <line x1="7" y1="-2" x2="10" y2="-5" stroke="#3ce000" stroke-width="0.6"/>
              <line x1="-7" y1="2" x2="-10" y2="5" stroke="#3ce000" stroke-width="0.6"/>
              <line x1="7" y1="2" x2="10" y2="5" stroke="#3ce000" stroke-width="0.6"/>
            </g>
          `).join('')}
        </g>
        <!-- After 30y label -->
        <g transform="translate(20,120)">
          <text x="100" y="0" fill="#ff8a3d" font-size="10" font-family="Barlow Condensed" text-anchor="middle">↓ ${yr30}</text>
          ${[0,1,2,3,4,5].map(i => {
            const broken = (i===1 || i===2 || i===3 || i===4);
            return `
              <circle cx="${i*30+15}" cy="20" r="9" fill="${broken?'transparent':'rgba(255,138,61,0.5)'}" stroke="${broken?'rgba(255,138,61,0.4)':'#ff8a3d'}" stroke-dasharray="${broken?'2 1':''}"/>
              ${i<5 ? `<line x1="${i*30+24}" y1="20" x2="${(i+1)*30+6}" y2="20" stroke="${(broken || (i+1===1||i+1===2||i+1===3||i+1===4))?'rgba(255,138,61,0.15)':'#ff8a3d'}" stroke-width="1" stroke-dasharray="2 2"/>` : ''}
            `;
          }).join('')}
        </g>
        <!-- Water passing through -->
        <text x="120" y="180" fill="#0099dd" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">💧 ${lang==='ja'?'再漏水':lang==='zh'?'再漏水':'Re-leak'}</text>
        <text x="120" y="200" fill="#ff8a3d" font-size="10" font-family="Barlow Condensed" text-anchor="middle">${utLabel}</text>

        <!-- Divider -->
        <line x1="240" y1="20" x2="240" y2="240" stroke="#2a4060" stroke-width="1" stroke-dasharray="3 3"/>

        <!-- RIGHT: Narulight C5 resin -->
        <text x="360" y="22" fill="#00c4ff" font-size="11" font-family="Barlow Condensed" font-weight="700" text-anchor="middle">Narulight · ${nlChain}</text>

        <!-- Intact resin matrix (lattice) -->
        <g transform="translate(260,40)">
          ${[0,1,2,3,4,5].map(i => `
            <circle cx="${i*30+15}" cy="14" r="9" fill="rgba(0,196,255,0.85)"/>
            ${i<5 ? `<line x1="${i*30+24}" y1="14" x2="${(i+1)*30+6}" y2="14" stroke="#00c4ff" stroke-width="3"/>` : ''}
          `).join('')}
        </g>
        <!-- Microbes bouncing off (with X mark) -->
        <g transform="translate(260,82)">
          ${[35, 95, 155].map(x => `
            <g transform="translate(${x},0)">
              <ellipse cx="0" cy="0" rx="6" ry="4" fill="#1a3a1a" stroke="#3ce000" stroke-width="0.8" opacity="0.4"/>
              <line x1="-7" y1="-7" x2="7" y2="7" stroke="#ff4444" stroke-width="1.5"/>
              <line x1="-7" y1="7" x2="7" y2="-7" stroke="#ff4444" stroke-width="1.5"/>
            </g>
          `).join('')}
        </g>
        <!-- After 30y label -->
        <g transform="translate(260,120)">
          <text x="100" y="0" fill="#00c4ff" font-size="10" font-family="Barlow Condensed" text-anchor="middle">↓ ${yr30}</text>
          ${[0,1,2,3,4,5].map(i => `
            <circle cx="${i*30+15}" cy="20" r="9" fill="rgba(0,196,255,0.85)"/>
            ${i<5 ? `<line x1="${i*30+24}" y1="20" x2="${(i+1)*30+6}" y2="20" stroke="#00c4ff" stroke-width="3"/>` : ''}
          `).join('')}
        </g>
        <!-- intact -->
        <text x="360" y="180" fill="#00e5a8" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">✓ ${lang==='ja'?'防水層 健全':lang==='zh'?'防水層健全':'Membrane intact'}</text>
        <text x="360" y="200" fill="#00c4ff" font-size="10" font-family="Barlow Condensed" text-anchor="middle">${nlLabel}</text>
      </svg>
    `;
  }

  // Diagram: Coverage philosophy (mini roof plans)
  function svgCoverage(){
    const lang = getLang();
    const utShort = T[lang].legend_ut;
    const utL = lang==='ja'?utShort+' ─ 局所注入':lang==='zh'?utShort+' ─ 局部灌注':utShort+' — local injection';
    const nlL = lang==='ja'?'ナルライト ─ 全面注入':lang==='zh'?'Narulight ─ 全面灌注':'Narulight — full coverage';
    // Left mini plan: only a circle of holes near a leak point
    let utHoles = '';
    for(let yy=0; yy<6; yy++){
      for(let xx=0; xx<6; xx++){
        const cx = 30 + xx*22;
        const cy = 50 + yy*22;
        // Only show holes inside 3m circle around (74, 116) (center-ish)
        const dx = cx - 96, dy = cy - 116;
        if (Math.sqrt(dx*dx + dy*dy) < 45) utHoles += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="#ff8a3d"/>`;
      }
    }
    // Right: full grid of holes
    let nlHoles = '';
    for(let yy=0; yy<6; yy++){
      for(let xx=0; xx<6; xx++){
        const cx = 270 + xx*22;
        const cy = 50 + yy*22;
        nlHoles += `<circle cx="${cx}" cy="${cy}" r="2.4" fill="#00c4ff"/>`;
      }
    }
    return `
      <svg viewBox="0 0 480 230" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="230" fill="transparent"/>
        <!-- Left plan box -->
        <rect x="20" y="40" width="140" height="140" fill="#0a1525" stroke="#3a5070" stroke-width="1"/>
        <!-- 3m radius circle -->
        <circle cx="96" cy="116" r="44" fill="rgba(255,138,61,0.08)" stroke="#ff8a3d" stroke-width="1" stroke-dasharray="3 2"/>
        <circle cx="96" cy="116" r="2.5" fill="#ff8a3d"/>
        <text x="96" y="113" fill="#ff8a3d" font-size="8" font-family="Barlow Condensed" text-anchor="middle">💧</text>
        ${utHoles}
        <text x="90" y="34" fill="#ff8a3d" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${utL}</text>

        <!-- Right plan box -->
        <rect x="260" y="40" width="140" height="140" fill="#0a1525" stroke="#3a5070" stroke-width="1"/>
        ${nlHoles}
        <text x="330" y="34" fill="#00c4ff" font-size="11" font-family="Barlow Condensed" text-anchor="middle" font-weight="700">${nlL}</text>

        <!-- Coverage indicator -->
        <text x="90" y="202" fill="#ff8a3d" font-size="14" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">~ 25 m²</text>
        <text x="90" y="216" fill="#5a7090" font-size="9" font-family="Barlow Condensed" text-anchor="middle">${lang==='ja'?'局所のみ':lang==='zh'?'僅局部':'local only'}</text>

        <text x="330" y="202" fill="#00c4ff" font-size="14" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">100 %</text>
        <text x="330" y="216" fill="#5a7090" font-size="9" font-family="Barlow Condensed" text-anchor="middle">${lang==='ja'?'屋上全面':lang==='zh'?'屋頂全面':'whole roof'}</text>

        <!-- Arrow -->
        <line x1="170" y1="116" x2="250" y2="116" stroke="#5a7090" stroke-width="1" stroke-dasharray="3 2"/>
        <path d="M245 112 L253 116 L245 120 Z" fill="#5a7090"/>
      </svg>
    `;
  }

  // Diagram: Material safety
  function svgSafety(){
    const lang = getLang();
    const utL = lang==='ja'?'有機溶剤系':lang==='zh'?'有機溶劑系':'Solvent-based';
    const nlL = lang==='ja'?'水性 ─ 居住中も安全':lang==='zh'?'水性 ─ 居住中亦安全':'Water-based — occupied-safe';
    return `
      <svg viewBox="0 0 480 230" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="230" fill="transparent"/>

        <!-- UT-230 side: solvent drum + warning -->
        <g transform="translate(60,52)">
          <!-- Drum -->
          <rect x="-22" y="0" width="44" height="60" rx="3" fill="#7a3c12" stroke="#ff8a3d" stroke-width="1.5"/>
          <ellipse cx="0" cy="0" rx="22" ry="5" fill="#a05010" stroke="#ff8a3d" stroke-width="1.5"/>
          <rect x="-15" y="14" width="30" height="14" fill="#ffb86b"/>
          <text x="0" y="25" fill="#7a3c12" font-size="9" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">PU</text>
          <text x="0" y="36" fill="#ffb86b" font-size="6" font-family="Barlow Condensed" text-anchor="middle">SOLVENT</text>
          <!-- Skull/warning -->
          <g transform="translate(0,80)">
            <polygon points="0,-12 12,8 -12,8" fill="none" stroke="#ff4444" stroke-width="2"/>
            <text x="0" y="6" fill="#ff4444" font-size="13" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">!</text>
          </g>
        </g>
        <text x="60" y="42" fill="#ff8a3d" font-size="11" font-family="Barlow Condensed" font-weight="700" text-anchor="middle">${utL}</text>
        <text x="60" y="208" fill="#ff8a3d" font-size="14" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">PPE / ${lang==='ja'?'換気':lang==='zh'?'通風':'Vent.'}</text>

        <!-- Divider -->
        <line x1="180" y1="40" x2="180" y2="195" stroke="#2a4060" stroke-width="1" stroke-dasharray="3 3"/>

        <!-- Narulight side: water drop + check -->
        <g transform="translate(280,72)">
          <!-- Building (occupied) -->
          <rect x="-30" y="-12" width="60" height="60" fill="#0a1525" stroke="#00c4ff" stroke-width="1.2"/>
          ${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${-25+c*18}" y="${-7+r*18}" width="10" height="10" fill="rgba(0,196,255,0.15)" stroke="#00c4ff" stroke-width="0.6"/>`).join('')).join('')}
          <text x="0" y="60" fill="#00e5a8" font-size="9" font-family="Barlow Condensed" font-weight="700" text-anchor="middle">${lang==='ja'?'居住中 OK':lang==='zh'?'居住中可施工':'Occupied OK'}</text>
        </g>
        <!-- Water drop -->
        <g transform="translate(370,90)">
          <path d="M0 -20 Q14 0, 0 18 Q-14 0, 0 -20" fill="rgba(0,196,255,0.3)" stroke="#00c4ff" stroke-width="1.4"/>
          <text x="0" y="3" fill="#00c4ff" font-size="10" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">H₂O</text>
        </g>
        <text x="340" y="42" fill="#00c4ff" font-size="11" font-family="Barlow Condensed" font-weight="700" text-anchor="middle">${nlL}</text>
        <text x="340" y="208" fill="#00e5a8" font-size="13" font-family="Barlow Condensed" font-weight="800" text-anchor="middle">JWWA ✓ · 0% VOC</text>
      </svg>
    `;
  }

  // ====== BUILD ======
  function build(){
    const t = T[getLang()];

    // Performance rows
    const perfRows = t.perf_rows.map(([axis, utV, nlV, win]) => {
      let cls = 'win-tie';
      let label = win;
      if (win === 'UT' || win === 'PU' || win === 'UT-230') { cls = 'win-ut'; label = t.legend_ut; }
      else if (win === 'NL' || win === 'Narulight' || win === 'ナルライト') { cls = 'win-nl'; label = t.legend_nl; }
      else if (win === 'TIE' || win === 'Tie' || win === '同等') {
        cls = 'win-tie';
        label = getLang()==='ja'?'同等':getLang()==='zh'?'同等':'Tie';
      }
      return `
        <div class="cmp-perf-row">
          <div class="cmp-perf-axis">${axis}</div>
          <div class="cmp-perf-bar ut"><div class="fill" data-w="${utV}" style="width:0%"></div><span class="val">${utV}</span></div>
          <div class="cmp-perf-bar nl"><div class="fill" data-w="${nlV}" style="width:0%"></div><span class="val">${nlV}</span></div>
          <div class="cmp-perf-win ${cls}">${label}</div>
        </div>
      `;
    }).join('');

    // App rows
    const appRows = t.app_rows.map(([scene, utStars, nlStars, winner]) => {
      const renderStars = (n, klass) => {
        let html = '<div class="rating">';
        for (let i=0;i<3;i++) html += `<span class="star ${i<n?'on '+klass:'off'}">★</span>`;
        html += '</div>';
        return html;
      };
      const winLabel = winner === 'NL' ? t.legend_nl : t.legend_ut;
      const winCls = winner === 'NL' ? 'nl' : 'ut';
      return `
        <tr>
          <td>${scene}</td>
          <td class="center">${renderStars(utStars,'ut')}</td>
          <td class="center">${renderStars(nlStars,'nl')}</td>
          <td class="center"><span class="winner ${winCls}">${winLabel}</span></td>
        </tr>
      `;
    }).join('');

    return `
      <div class="container">
        <div class="section-label">${t.label}</div>
        <div class="section-title">${t.title}</div>
        <p class="cmp-lead">${t.lead}</p>

        <!-- ===== Two Philosophies ===== -->
        <div class="cmp-subhead">
          <div class="section-label">${t.phil_label}</div>
          <div class="section-title" style="font-size:clamp(28px,3.5vw,42px)">${t.phil_title}</div>
          <p class="section-sub" style="margin-top:8px">${t.phil_sub}</p>
        </div>
        <div class="cmp-phil fade-in">
          <div class="cmp-phil-card ut">
            <div class="cmp-brand-row"><span class="cmp-brand">${t.ut_brand}</span><span class="cmp-brand-sub">${t.ut_brand_sub}</span></div>
            <div class="cmp-phil-h">${t.ut_phil_t}</div>
            <div class="cmp-phil-svg">${svgUT()}</div>
            <div class="cmp-phil-d">${t.ut_phil_d}</div>
            <div class="cmp-bullets">
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.ut_b1_t}</div><div class="cmp-bullet-v">${t.ut_b1_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.ut_b2_t}</div><div class="cmp-bullet-v">${t.ut_b2_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.ut_b3_t}</div><div class="cmp-bullet-v">${t.ut_b3_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.ut_b4_t}</div><div class="cmp-bullet-v">${t.ut_b4_v}</div></div>
            </div>
          </div>
          <div class="cmp-phil-card nl">
            <div class="cmp-brand-row"><span class="cmp-brand">${t.nl_brand}</span><span class="cmp-brand-sub">${t.nl_brand_sub}</span></div>
            <div class="cmp-phil-h">${t.nl_phil_t}</div>
            <div class="cmp-phil-svg">${svgNL()}</div>
            <div class="cmp-phil-d">${t.nl_phil_d}</div>
            <div class="cmp-bullets">
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.nl_b1_t}</div><div class="cmp-bullet-v">${t.nl_b1_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.nl_b2_t}</div><div class="cmp-bullet-v">${t.nl_b2_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.nl_b3_t}</div><div class="cmp-bullet-v">${t.nl_b3_v}</div></div>
              <div class="cmp-bullet"><div class="cmp-bullet-k">${t.nl_b4_t}</div><div class="cmp-bullet-v">${t.nl_b4_v}</div></div>
            </div>
          </div>
        </div>

        <!-- ===== Material DNA ===== -->
        <div class="cmp-subhead">
          <div class="section-label">${t.dna_label}</div>
          <div class="section-title" style="font-size:clamp(28px,3.5vw,42px)">${t.dna_title}</div>
          <p class="section-sub" style="margin-top:8px">${t.dna_sub}</p>
        </div>
        <div class="cmp-dna fade-in">
          <div class="cmp-dna-head">
            <div class="cmp-dna-h-cell">${t.perf_axis}</div>
            <div class="cmp-dna-h-cell ut"><div class="cmp-dna-h-brand">${t.dna_ut_t}</div></div>
            <div class="cmp-dna-h-cell nl"><div class="cmp-dna-h-brand">${t.dna_nl_t}</div></div>
          </div>
          ${[
            ['base','dna_ut_base','dna_nl_base','',''],
            ['state','dna_ut_state','dna_nl_state','',''],
            ['flow','dna_ut_flow','dna_nl_flow','warn','good'],
            ['cure','dna_ut_cure','dna_nl_cure','',''],
            ['curetime','dna_ut_curetime','dna_nl_curetime','warn','good'],
            ['solids','dna_ut_solids','dna_nl_solids','',''],
            ['expand','dna_ut_expand','dna_nl_expand','warn','good'],
            ['elong','dna_ut_elong','dna_nl_elong','warn','good'],
            ['redis','dna_ut_redis','dna_nl_redis','',''],
            ['micro','dna_ut_micro','dna_nl_micro','warn','good'],
            ['solvent','dna_ut_solvent','dna_nl_solvent','warn','good'],
            ['cleanup','dna_ut_cleanup','dna_nl_cleanup','','good'],
            ['record','dna_ut_record','dna_nl_record','warn','good'],
          ].map(([k, ukey, nkey, ucls, ncls]) => `
            <div class="cmp-dna-row">
              <div class="cmp-dna-cell k">${t['dna_prop_'+k]}</div>
              <div class="cmp-dna-cell v ${ucls}">${t[ukey]}</div>
              <div class="cmp-dna-cell v ${ncls}">${t[nkey]}</div>
            </div>
          `).join('')}
        </div>

        <!-- ===== 3 Differentiators ===== -->
        <div class="cmp-subhead">
          <div class="section-label">${t.diff_label}</div>
          <div class="section-title" style="font-size:clamp(28px,3.5vw,42px)">${t.diff_title}</div>
        </div>
        <div class="cmp-diffs fade-in">
          <div class="cmp-diff">
            <div class="cmp-diff-art">${svgMicro()}</div>
            <div class="cmp-diff-body">
              <div class="cmp-diff-no">${t.diff1_no}</div>
              <div class="cmp-diff-t">${t.diff1_t}</div>
              <div class="cmp-diff-sub">${t.diff1_sub}</div>
              <p class="cmp-diff-d">${t.diff1_d}</p>
              <div class="cmp-diff-stats">
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff1_stat1_v}</div><div class="cmp-diff-stat-l">${t.diff1_stat1_l}</div></div>
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff1_stat2_v}</div><div class="cmp-diff-stat-l">${t.diff1_stat2_l}</div></div>
              </div>
            </div>
          </div>
          <div class="cmp-diff">
            <div class="cmp-diff-art">${svgCoverage()}</div>
            <div class="cmp-diff-body">
              <div class="cmp-diff-no">${t.diff2_no}</div>
              <div class="cmp-diff-t">${t.diff2_t}</div>
              <div class="cmp-diff-sub">${t.diff2_sub}</div>
              <p class="cmp-diff-d">${t.diff2_d}</p>
              <div class="cmp-diff-stats">
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff2_stat1_v}</div><div class="cmp-diff-stat-l">${t.diff2_stat1_l}</div></div>
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff2_stat2_v}</div><div class="cmp-diff-stat-l">${t.diff2_stat2_l}</div></div>
              </div>
            </div>
          </div>
          <div class="cmp-diff">
            <div class="cmp-diff-art">${svgSafety()}</div>
            <div class="cmp-diff-body">
              <div class="cmp-diff-no">${t.diff3_no}</div>
              <div class="cmp-diff-t">${t.diff3_t}</div>
              <div class="cmp-diff-sub">${t.diff3_sub}</div>
              <p class="cmp-diff-d">${t.diff3_d}</p>
              <div class="cmp-diff-stats">
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff3_stat1_v}</div><div class="cmp-diff-stat-l">${t.diff3_stat1_l}</div></div>
                <div class="cmp-diff-stat"><div class="cmp-diff-stat-v">${t.diff3_stat2_v}</div><div class="cmp-diff-stat-l">${t.diff3_stat2_l}</div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== Performance matrix ===== -->
        <div class="cmp-subhead">
          <div class="section-label">${t.perf_label}</div>
          <div class="section-title" style="font-size:clamp(28px,3.5vw,42px)">${t.perf_title}</div>
          <p class="section-sub" style="margin-top:8px">${t.perf_sub}</p>
        </div>
        <div class="cmp-perf fade-in" id="cmpPerf">
          <div class="cmp-perf-legend">
            <span class="swatch"><span class="dot ut"></span> ${t.legend_ut}</span>
            <span class="swatch"><span class="dot nl"></span> ${t.legend_nl}</span>
          </div>
          <div class="cmp-perf-row" style="border-bottom:1px solid var(--border); padding-bottom:8px">
            <div class="col-h">${t.perf_axis}</div>
            <div class="col-h" style="text-align:center;color:#ff8a3d">${t.legend_ut}</div>
            <div class="col-h" style="text-align:center;color:var(--accent)">${t.legend_nl}</div>
            <div class="col-h" style="text-align:right">${t.perf_better}</div>
          </div>
          ${perfRows}
        </div>

        <!-- ===== Application matrix ===== -->
        <div class="cmp-subhead">
          <div class="section-label">${t.app_label}</div>
          <div class="section-title" style="font-size:clamp(28px,3.5vw,42px)">${t.app_title}</div>
          <p class="section-sub" style="margin-top:8px">${t.app_sub}</p>
        </div>
        <div class="cmp-app fade-in">
          <table>
            <thead>
              <tr>
                <th>${t.app_th_scene}</th>
                <th class="center" style="color:#ff8a3d">${t.app_th_ut}</th>
                <th class="center" style="color:var(--accent)">${t.app_th_nl}</th>
                <th class="center">${t.app_th_winner}</th>
              </tr>
            </thead>
            <tbody>${appRows}</tbody>
          </table>
        </div>

        <div class="cmp-foot">${t.foot}</div>
      </div>
    `;
  }

  function render(){
    const sec = document.getElementById('comparison');
    if (!sec) return;
    sec.innerHTML = build();
    // Animate the bars when visible
    requestAnimationFrame(() => {
      const fills = sec.querySelectorAll('.cmp-perf-bar .fill');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            sec.querySelectorAll('.cmp-perf-bar .fill').forEach(f => {
              f.style.width = (f.dataset.w || '0') + '%';
            });
            observer.disconnect();
          }
        });
      }, { threshold: 0.18 });
      const perf = sec.querySelector('#cmpPerf');
      if (perf) observer.observe(perf);
      // Trigger fade-ins
      sec.querySelectorAll('.fade-in').forEach(el => {
        const fo = new IntersectionObserver((ents) => {
          ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, {threshold: 0.08});
        fo.observe(el);
      });
    });
  }

  function inject(){
    // Add styles
    const styleTag = document.createElement('style');
    styleTag.id = 'cmp-styles';
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);

    // Inject section before #lcc (so the build is: how → adv → timeline → 3d → specs → COMPARE → lcc → cta)
    const lccSec = document.getElementById('lcc');
    const section = document.createElement('section');
    section.id = 'comparison';
    if (lccSec && lccSec.parentNode) {
      lccSec.parentNode.insertBefore(section, lccSec);
    } else {
      // Fallback: append to body before footer
      const footer = document.querySelector('footer');
      if (footer) footer.parentNode.insertBefore(section, footer);
      else document.body.appendChild(section);
    }

    // Add nav link (between specs and lcc)
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const lccLink = navLinks.querySelector('a[href="#lcc"]');
      const newLink = document.createElement('a');
      newLink.href = '#comparison';
      newLink.setAttribute('data-cmp-nav', '1');
      newLink.textContent = L('nav');
      if (lccLink) navLinks.insertBefore(newLink, lccLink);
      else navLinks.appendChild(newLink);
    }
  }

  function updateNav(){
    const link = document.querySelector('.nav-links a[data-cmp-nav]');
    if (link) link.textContent = L('nav');
  }

  function watchLang(){
    const obs = new MutationObserver(() => {
      render();
      updateNav();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function init(){
    inject();
    watchLang();
    render();
    updateNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
