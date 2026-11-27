/* Narulight Quotation Generator
   Pricing reference (manufacturer 2024.10.01 design price list + technical data):
   - Narulight injection: 1,850 JPY/kg (20kg/can = 37,000 JPY)
   - Aロフィックス MC accelerator: 15% by weight
   - Material consumption (官方目安):
       保護防水 (no insulation): 4.6 kg Naru + 0.7 kg MC + 0.7 kg water = 6.0 kg/m² total
       保護断熱防水 (with insulation): 9.2 kg Naru + 1.4 kg MC + 1.4 kg water = 12.0 kg/m² total
       貫通注入 ≤150mm: 18.0 kg/m²
       貫通注入 >150mm: 18.0 kg/m²
   - Drill hole pitch: 500mm typical → 4 holes/m²; 1000mm → 1 hole/m²
   - Each hole = 1 cork + 1 mortar plug + drill-bit wear share
*/

(function(){
  // === BASELINE DATA ===
  const STRUCTURES = {
    'protect_no_insulation': {
      jp:'A. 保護防水（断熱層なし）', en:'A. Protected WP (no insulation)', zh:'A. 保護防水（無隔熱層）',
      naru_kg_m2: 4.6, mc_kg_m2: 0.7, total_kg_m2: 6.0,
      reference_design_price_jpy: 21200, // per m²
      has_insulation: false,
    },
    'protect_with_insulation': {
      jp:'B. 保護断熱防水（断熱層あり）', en:'B. Protected WP + thermal insulation', zh:'B. 保護隔熱防水（含隔熱層）',
      naru_kg_m2: 9.2, mc_kg_m2: 1.4, total_kg_m2: 12.0,
      reference_design_price_jpy: 35000,
      has_insulation: true,
    },
    'penetrate_thin': {
      jp:'貫通注入（≤150mm）', en:'Through-injection (≤150mm)', zh:'貫通注入（≤150mm）',
      naru_kg_m2: 13.8, mc_kg_m2: 2.1, total_kg_m2: 18.0,
      reference_design_price_jpy: 67500,
    },
    'penetrate_thick': {
      jp:'貫通注入（>150mm）', en:'Through-injection (>150mm)', zh:'貫通注入（>150mm）',
      naru_kg_m2: 13.8, mc_kg_m2: 2.1, total_kg_m2: 18.0,
      reference_design_price_jpy: 71000,
    },
  };

  // Pitch options (most reliable values per technical resource)
  const PITCH_OPTIONS = [
    { value: 0.3, label_jp:'300 mm（細密）', label_en:'300 mm (dense)', label_zh:'300 mm（密）' },
    { value: 0.5, label_jp:'500 mm（標準推奨）', label_en:'500 mm (standard / recommended)', label_zh:'500 mm（標準推薦）' },
    { value: 0.6, label_jp:'600 mm', label_en:'600 mm', label_zh:'600 mm' },
    { value: 0.8, label_jp:'800 mm', label_en:'800 mm', label_zh:'800 mm' },
    { value: 1.0, label_jp:'1000 mm（保護層厚100mm以上）', label_en:'1000 mm (≥100mm protective)', label_zh:'1000 mm（保護層≥100mm）' },
    { value: 1.5, label_jp:'1500 mm', label_en:'1500 mm', label_zh:'1500 mm' },
    { value: 2.0, label_jp:'2000 mm（最大）', label_en:'2000 mm (max)', label_zh:'2000 mm（最大）' },
  ];

  const PROTECTION_THICKNESS = [
    { value: 50, label_jp:'～50 mm（薄）', label_en:'~50 mm (thin)', label_zh:'～50 mm（薄）' },
    { value: 80, label_jp:'50–80 mm', label_en:'50–80 mm', label_zh:'50–80 mm' },
    { value: 100, label_jp:'80–100 mm（標準）', label_en:'80–100 mm (typ.)', label_zh:'80–100 mm（標準）' },
    { value: 150, label_jp:'100–150 mm', label_en:'100–150 mm', label_zh:'100–150 mm' },
    { value: 200, label_jp:'150 mm 超', label_en:'>150 mm', label_zh:'150 mm 以上' },
  ];

  const INSULATION_TYPE = [
    { value:'none',  label_jp:'なし（モデル A）', label_en:'None (Model A)', label_zh:'無（A 型）' },
    { value:'xps',   label_jp:'押出ポリスチレン (XPS)', label_en:'Extruded polystyrene (XPS)', label_zh:'擠塑聚苯乙烯 (XPS)' },
    { value:'eps',   label_jp:'発泡ポリスチレン (EPS)', label_en:'Expanded polystyrene (EPS)', label_zh:'發泡聚苯乙烯 (EPS)' },
    { value:'pir',   label_jp:'硬質ウレタン (PIR/PUR)', label_en:'Polyiso / PUR board', label_zh:'硬質聚氨酯 (PIR/PUR)' },
    { value:'glass', label_jp:'グラスウール / 発泡ガラス', label_en:'Glass / foam glass', label_zh:'玻璃棉 / 發泡玻璃' },
  ];

  const INSULATION_THICKNESS = [
    { value: 0,   label_jp:'—', label_en:'—', label_zh:'—' },
    { value: 25,  label_jp:'25 mm', label_en:'25 mm', label_zh:'25 mm' },
    { value: 30,  label_jp:'30 mm', label_en:'30 mm', label_zh:'30 mm' },
    { value: 50,  label_jp:'50 mm（標準）', label_en:'50 mm (typ.)', label_zh:'50 mm（標準）' },
    { value: 75,  label_jp:'75 mm', label_en:'75 mm', label_zh:'75 mm' },
    { value: 100, label_jp:'100 mm', label_en:'100 mm', label_zh:'100 mm' },
  ];

  const SQM_PER_LABOR = [
    { value: 16, label_jp:'16 m²/人日（複雑形状）', label_en:'16 m²/labor·day (complex)', label_zh:'16 m²/人日（複雜）' },
    { value: 24, label_jp:'24 m²/人日（標準）', label_en:'24 m²/labor·day (standard)', label_zh:'24 m²/人日（標準）' },
    { value: 30, label_jp:'30 m²/人日（推奨平均）', label_en:'30 m²/labor·day (recommended avg.)', label_zh:'30 m²/人日（建議平均）' },
    { value: 40, label_jp:'40 m²/人日（広い平面）', label_en:'40 m²/labor·day (open area)', label_zh:'40 m²/人日（廣面平整）' },
    { value: 50, label_jp:'50 m²/人日（条件良好）', label_en:'50 m²/labor·day (ideal)', label_zh:'50 m²/人日（條件佳）' },
  ];

  const LABOR_RATE_OPTIONS = [
    { value: 2000, label:'TWD 2,000 / 人日' },
    { value: 2200, label:'TWD 2,200 / 人日' },
    { value: 2500, label:'TWD 2,500 / 人日（標準/Standard/標準）' },
    { value: 2800, label:'TWD 2,800 / 人日' },
    { value: 3200, label:'TWD 3,200 / 人日（熟練/Skilled/熟練工）' },
    { value: 4000, label:'TWD 4,000 / 人日（班長/Foreman/班長）' },
  ];

  // FX (manufacturer prices are in JPY; we convert reference to TWD for transparency,
  // but quotation is built bottom-up in TWD using actual material/labor costs)
  const FX_DEFAULT_JPY_TO_TWD = 0.21; // approximate; user-adjustable

  // Default unit costs in TWD (user-adjustable)
  const DEFAULT_COSTS_TWD = {
    naru_per_kg: 980,        // updated TWD price (was 850)
    mc_per_kg: 150,           // updated TWD price (was 80)
    cork_each: 8,
    mortar_per_hole: 15,
    drill_bit_each: 350,     // 10-12mm masonry bit, replaced after wear
    drill_bit_lifetime_holes: 80, // empirical; one bit drills ~80 holes through cinder + WP
    drill_bit_lifetime_holes_ins: 55, // shorter life when drilling through insulation (longer hole, more friction/heat)
    nozzle_each: 120,        // injection nozzle (replaceable head)
    nozzle_each_long: 180,   // extended nozzle for insulation systems
    nozzle_lifetime_holes: 200,
    boric_acid_per_m2: 5,    // boric acid spray, minor
    sundry_per_m2: 25,       // wipes, sponges, water, electricity share
  };

  // === STATE ===
  const STATE = {
    company: { name:'史塔克工業 Stark Industries', logo:'', address:'', phone:'', email:'', tax_id:'', contact:'' },
    client:  { name:'', project:'', site:'', date: new Date().toISOString().slice(0,10), quote_no:'NL-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-001' },
    project: {
      structure: 'protect_no_insulation',
      area_m2: 500,
      length_m: 25,
      width_m: 20,
      shape: 'rect',
      protection_thickness: 100,
      insulation_type: 'none',
      insulation_thickness: 0,
      pitch_m: 0.5,
      sqm_per_labor: 30,
      labor_rate: 2500,
      management_pct: 10,
      profit_pct: 50,
      tax_pct: 5,
      fx_jpy_twd: FX_DEFAULT_JPY_TO_TWD,
    },
    costs: { ...DEFAULT_COSTS_TWD },
  };

  // === UTILS ===
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const fmt = (n) => 'NT$ ' + Math.round(n).toLocaleString('en-US');
  const fmtKg = (n) => n.toFixed(2) + ' kg';
  const getLang = () => (document.documentElement.lang === 'en' ? 'en' : document.documentElement.lang === 'zh-TW' ? 'zh' : 'jp');

  // === COMPUTATION ===
  function compute(){
    const p = STATE.project, c = STATE.costs;
    const struct = STRUCTURES[p.structure];
    const A = +p.area_m2 || 0;

    // Material — apply 5% wastage
    const WASTE = 1.05;
    const naru_kg = struct.naru_kg_m2 * A * WASTE;
    const mc_kg = struct.mc_kg_m2 * A * WASTE;

    // Holes — pitch grid: holes = (1 / pitch²) × area
    const holes = Math.ceil(A / (p.pitch_m * p.pitch_m));

    // Consumables — adjust drill-bit life and nozzle unit price for insulated systems
    const cork_qty = holes;
    const mortar_qty = holes;
    const isInsulated = !!struct.has_insulation;
    const bitLife = isInsulated ? c.drill_bit_lifetime_holes_ins : c.drill_bit_lifetime_holes;
    const nozzleUnit = isInsulated ? c.nozzle_each_long : c.nozzle_each;
    const drill_bits = Math.ceil(holes / bitLife);
    const nozzles = Math.ceil(holes / c.nozzle_lifetime_holes);

    // Material costs
    const naru_cost = naru_kg * c.naru_per_kg;
    const mc_cost = mc_kg * c.mc_per_kg;
    const cork_cost = cork_qty * c.cork_each;
    const mortar_cost = mortar_qty * c.mortar_per_hole;
    const bit_cost = drill_bits * c.drill_bit_each;
    const nozzle_cost = nozzles * nozzleUnit;
    const boric_cost = A * c.boric_acid_per_m2;
    const sundry_cost = A * c.sundry_per_m2;
    const material_subtotal = naru_cost + mc_cost + cork_cost + mortar_cost + bit_cost + nozzle_cost + boric_cost + sundry_cost;

    // Labor
    const labor_days = A / p.sqm_per_labor;
    const labor_cost = labor_days * p.labor_rate;

    // Direct cost
    const direct_cost = material_subtotal + labor_cost;

    // Overhead, profit, tax
    const mgmt = direct_cost * (p.management_pct/100);
    const after_mgmt = direct_cost + mgmt;
    const profit = after_mgmt * (p.profit_pct/100);
    const subtotal_pre_tax = after_mgmt + profit;
    const tax = subtotal_pre_tax * (p.tax_pct/100);
    const grand_total = subtotal_pre_tax + tax;
    const unit_price = grand_total / A;

    return {
      struct, A, naru_kg, mc_kg, holes, isInsulated, bitLife, nozzleUnit,
      cork_qty, mortar_qty, drill_bits, nozzles,
      naru_cost, mc_cost, cork_cost, mortar_cost, bit_cost, nozzle_cost, boric_cost, sundry_cost,
      material_subtotal,
      labor_days, labor_cost,
      direct_cost, mgmt, profit, subtotal_pre_tax, tax, grand_total, unit_price,
    };
  }

  // === I18N ===
  const T = {
    jp:{
      sec_label:'STEP 5 — 見積発行', sec_title:'自動見積生成システム',
      sec_sub:'プロジェクト情報を入力すると、メーカー資料に基づく材料消費量と歩掛を自動計算し、A4プレビューと PDF 出力を行います。',
      panel_company:'1. 御見積発行元（御社情報）',
      panel_client:'2. 客先 / プロジェクト情報',
      panel_project:'3. 構造・施工条件',
      panel_costs:'4. 単価設定（材料・労務）',
      panel_overhead:'5. 諸掛・利益・税',
      panel_preview:'6. A4 見積書プレビュー',
      f_company:'会社名', f_logo:'ロゴ画像', f_address:'住所', f_phone:'電話', f_email:'Email', f_taxid:'統一編号', f_contact:'担当者',
      f_client_name:'客先名称', f_project_name:'プロジェクト名', f_site:'施工場所', f_date:'発行日', f_quote_no:'見積番号',
      f_structure:'構造区分', f_area:'施工面積 (m²)', f_length:'長さ L (m)', f_width:'幅 W (m)', f_shape:'平面形状', f_thickness:'保護層厚み', f_pitch:'注入穴ピッチ',
      f_ins_type:'断熱材種別', f_ins_thick:'断熱材厚み',
      f_sqm:'施工歩掛 (m²/人日)', f_labor:'労務単価 (TWD/人日)',
      f_naru:'ナルライト注入材 (TWD/kg)', f_mc:'アロフィックス MC (TWD/kg)',
      f_cork:'木栓 (TWD/個)', f_mortar:'急結モルタル (TWD/穴)',
      f_bit:'ドリルビット (TWD/本)', f_bitlife:'ビット寿命 (穴/本)',
      f_nozzle:'注入ノズル (TWD/個)', f_nozzlelife:'ノズル寿命 (穴/個)',
      f_boric:'ホウ酸その他 (TWD/m²)', f_sundry:'雑費 (TWD/m²)',
      f_mgmt:'現場管理費 (%)', f_profit:'利益 (%)', f_tax:'消費税 (%)',
      btn_recalc:'再計算 / プレビュー更新', btn_pdf:'施工要領書をダウンロード', btn_send:'コピーを送信...', btn_contractor:'PDF（業者控え）+ メール作成', btn_client:'PDF（クライアント用）+ メール作成',
      client_title:'クライアント提出用 PDF + メール',
      client_intro:'本機能は、(1) 見積書PDFを保存し、(2) 一式表記（材料費・労務費をまとめた見積金額）のメールを開きます。原価・利益は表示されませんが、合計金額は業者控え版と一致します。',
      client_default_subject:'御見積書のお送り — ',
      client_default_msg:'お世話になっております。本案の見積明細を下記の通りお送りいたします。',
      client_row_label:'材料費 + 労務費（一式）',
      client_row_spec:'見積面積一式',
      contractor_title:'業者控え用 PDF + メール',
      contractor_intro:'本機能は、(1) 標準の見積書PDFを保存し、(2) 原価・利益を含む完全な内訳を本文に展開した社内用メールを開きます。クライアントには送信しないでください。',
      contractor_default_subject:'【社内控え】見積書 — ',
      contractor_default_msg:'社内控え用：本案件の完全な原価・利益内訳は下記の通りです。',
      contractor_warn:'⚠ この内容には原価・粗利・利益率が含まれます。クライアントへ送らないでください。',
      contractor_h_proj:'■ 案件情報', contractor_h_mat:'■ 材料費', contractor_h_cons:'■ 消耗資材', contractor_h_labor:'■ 労務費', contractor_h_dc:'■ 直接工事費 小計', contractor_h_oh:'■ 諸経費・利益・税', contractor_h_margin:'■ 粗利サマリー',
      contractor_margin_dc:'直接原価', contractor_margin_total:'税抜売価', contractor_margin_gp:'粗利益（税抜売価−直接原価）', contractor_margin_pct:'粗利率',
      send_title:'見積書のコピーを送信',
      send_intro:'下記の宛先に、現在の見積書（PDF添付・件名・本文）をメールで送信します。送信前にご確認ください。',
      send_to_label:'送信先メールアドレス', send_subject_label:'件名', send_message_label:'メッセージ',
      send_default_subject:'御見積書のお送り', send_default_msg:'お世話になっております。本見積書をお送りいたしますので、ご査収のほどよろしくお願い申し上げます。',
      send_confirm:'送信する', send_cancel:'キャンセル',
      send_success:'メールクライアントを開きました。送信を完了してください。', send_blocked:'ブラウザがメールクライアントの起動をブロックしました。',
      send_attach_filename:'添付予定ファイル名', send_attach_hint:'※ メールクライアントが開いたら、ダウンロードした下記PDFファイルをドラッグ＆ドロップして添付してください。',
      send_attach_inline:'添付ファイル：下記のPDFを添付してください', send_step_pdf:'① PDF を保存してください（印刷ダイアログが開きます）', send_step_mail:'② メールが開いたら、保存したPDFを添付してください',
      q_title:'御見積書', q_to:'御中', q_subject:'件名',
      q_below:'拝啓　時下ますますご清祥のこととお慶び申し上げます。\n　平素は格別のお引き立てを賜り、誠にありがとうございます。\n　この度は数ある工法の中より、最も先進的かつ環境に配慮した防水層再生工法「ナルライト注入工法」をご採用いただき、心より厚く御礼申し上げます。\n　下記の通り御見積申し上げますので、ご検討の程よろしくお願い申し上げます。',
      plan_title:'施工平面図 (S=N.T.S.)', plan_legend_hole:'注入孔（'+'φ8.5×L80）', plan_legend_dim:'寸法', plan_area:'施工面積', plan_holes:'注入孔本数', plan_pitch:'孔ピッチ', plan_perim:'外周',
      sec_title_a:'断面図 — A. 保護防水（断熱層なし）', sec_title_b:'断面図 — B. 保護断熱防水（断熱層あり）',
      sec_l_slab:'RC スラブ', sec_l_wp:'既設防水層', sec_l_ins:'断熱層', sec_l_prot:'保護モルタル / 押え層', sec_l_naru:'ナルライト注入域', sec_l_hole:'注入孔 φ8.5 × L80',
      tbl_no:'No.', tbl_item:'項目', tbl_spec:'仕様 / 摘要', tbl_qty:'数量', tbl_unit:'単位', tbl_price:'単価', tbl_amount:'金額',
      sec_material:'材料費', sec_labor:'労務費', sec_consumables:'消耗資材',
      row_naru:'ナルライト注入用', row_mc:'アロフィックス MC（硬化促進剤）',
      row_cork:'木栓（コルク栓）', row_mortar:'急結モルタル仕上げ',
      row_bit:'振動ドリルビット (10–12φ)', row_nozzle:'注入ノズル',
      row_boric:'ホウ酸水溶液 等', row_sundry:'雑費（清掃・養生）',
      row_labor:'施工労務', row_subtotal_dc:'直接工事費 小計',
      row_mgmt:'現場管理費', row_profit:'一般管理費・利益', row_subtotal:'税抜小計', row_tax:'営業税', row_total:'合計',
      ref_unit_price:'単価換算',
      notes_title:'特記事項',
      notes:[
        '・本見積はメーカー成瀬化学株式会社の標準施工要領書（2019.6改訂）および設計価格表（2024.10.1）に基づき、材料消費量を自動算出しています。',
        '・現場の躯体厚み、内部残留水量、伸縮目地状態により注入量が増加する場合があります。',
        '・仮設足場、産廃処理、電源・水道、保証年限は別途協議となります。',
        '・本見積有効期限：発行日より 30 日間。',
      ],
      sig_issuer:'発行者', sig_recipient:'受領者',
      // === Method Statement i18n ===
      ms_title:'施工要領書 （METHOD STATEMENT）',
      ms_subtitle:'ナルライト注入防水層再生工法',
      ms_doc_no:'文書番号', ms_rev:'改訂', ms_date:'発行日', ms_pages:'ページ',
      ms_sec_project:'1. 工事概要',
      ms_sec_scope:'2. 作業範囲',
      ms_sec_materials:'3. 使用材料・装備',
      ms_sec_procedure:'4. 施工手順（8工程）',
      ms_sec_qaqc:'5. 品質管理（QA / QC）',
      ms_sec_hse:'6. 安全衛生・環境（HSE）',
      ms_sec_ppe:'7. 個人保護具（PPE）',
      ms_sec_drawings:'8. ショップドローイング（平面図・斷面図）',
      ms_sec_signoff:'9. 承認・署名',
      ms_pi_client:'発注者', ms_pi_project:'案件名', ms_pi_site:'現場住所', ms_pi_date:'発行日', ms_pi_quote:'見積番号',
      ms_pi_struct:'防水構造', ms_pi_area:'施工面積', ms_pi_lw:'平面寸法（L×W）', ms_pi_holes:'予定注入孔数', ms_pi_pitch:'孔ピッチ',
      ms_scope_intro:'本要領書は、以下の作業を規定します：',
      ms_scope_items:[
        '既設防水層上部の保護モルタル / 押え層を貫通してナルライトを加圧注入すること',
        '劣化した防水層を撤去せずに再生／護させ、渏水路を門闉状に充填すること',
        '注入完了後、木栓・急結モルタルによる孔始末を実施すること',
      ],
      ms_qaqc_items:[
        '防水電位計測を事前・事後に実施し、透水点の消失を確認する',
        '注入圧力（1.0～3.0 MPa）と一点あたりの注入量を記録する',
        '不育生不燃性を実際サンプルで確認する',
        'すべての孔シール部位はコアクを押し込み、表面仕上げと同一面に保つこと',
      ],
      ms_hse_items:[
        '作業員はヘルメット、保護眼鏡、防塵マスク、手袋を着用',
        '電動ドリル使用時はコード被覆状態を確認し、漏電遙断器を使用すること',
        'ナルライトは不育生不燃性、ホルムアルデヒド・トルエン・キシレン一切未使用、何もしろ作業中は十分換気を確保すること',
        '作業エリアはバリケードで隔離し、限りある作業員のみ立ち入りを許可すること',
      ],
      ms_signoff_a:'請負者代表', ms_signoff_b:'現場監督', ms_signoff_c:'発注者代表', ms_sign_name:'氏名', ms_sign_sig:'署名', ms_sign_date:'日付',
      ms_step_purpose:'目的', ms_step_dur:'作業時間', ms_step_tools:'使用装備', ms_step_check:'チェックポイント',
      ms_ppe_intro:'本工事の全作業員は、本書記載の個人保護具（PPE）を装着すること。現場入場前にチェックリストにより装備を確認する。',
      ms_ppe_item:'品目', ms_ppe_spec:'仕様', ms_ppe_purpose:'用途', ms_ppe_when:'適用工程',
      ms_ppe_rows:[
        ['ヘルメット', 'JIS T 8131 (Class A/B)', '上方からの落下物・衝突から頭部を保護', '全工程'],
        ['保護眼鏡 / ゴーグル', 'JIS T 8147 防塵・耐衝撃', '削孔切粉・樹脂飛散から眼球を保護', '工程 02・06'],
        ['防塵マスク', 'JIS T 8151 DS2 以上', 'コンクリート粉塵の吸入を防止', '工程 02・03'],
        ['有機ガス用マスク（必要時）', 'JIS T 8152 OV カートリッジ', '密閉空間における樹脂蒸気の吸入防止', '工程 04〜06（換気不足時）'],
        ['作業用手袋', '耐溶剤性ニトリル / 革手袋', '樹脂・工具による手部負傷を防止', '全工程'],
        ['安全靴', 'JIS T 8101 S3 級', '足部の落下物・突起物刺し抜きから保護', '全工程'],
        ['耳栓 / イヤーマフ', 'NRR 25 dB 以上', '振動ドリル騒音（>85 dB）から聴覚保護', '工程 02'],
        ['高視認性ベスト', 'JIS T 8127 Class 2', '車両・他作業員からの視認性確保', '屋外・夜間作業時'],
        ['漏電遮断器（携帯型）', 'GFCI / 30 mA 即時遮断', '電動工具使用時の感電防止', '工程 02・04・06'],
        ['転落防止フルハーネス', 'JIS T 8165 Type 1', '高所（≥ 2 m）での落下防止', '屋上端部・パラペット近傍作業'],
      ],
      ms_ppe_note:'※ 樹脂は水性タイプであり、ホルムアルデヒド・トルエン・キシレンを含まず厚生労働省指針値物質非該当。但し作業中は必ず換気を確保し、密閉空間では送風機による強制換気を行うこと。',
    },
    en:{
      sec_label:'STEP 5 — Quotation', sec_title:'Automated Quotation Generator',
      sec_sub:'Enter project parameters; material take-off and labor are auto-computed from manufacturer specifications. A4 preview & PDF download.',
      panel_company:'1. Issuer (Your Company)',
      panel_client:'2. Client / Project Information',
      panel_project:'3. Structure & Site Conditions',
      panel_costs:'4. Unit Costs (Material & Labor)',
      panel_overhead:'5. Overhead, Profit & Tax',
      panel_preview:'6. A4 Quotation Preview',
      f_company:'Company name', f_logo:'Logo image', f_address:'Address', f_phone:'Tel.', f_email:'Email', f_taxid:'Tax ID', f_contact:'Contact person',
      f_client_name:'Client name', f_project_name:'Project name', f_site:'Site location', f_date:'Issue date', f_quote_no:'Quote No.',
      f_structure:'Structure type', f_area:'Application area (m²)', f_length:'Length L (m)', f_width:'Width W (m)', f_shape:'Plan shape', f_thickness:'Protective layer thickness', f_pitch:'Injection hole pitch',
      f_ins_type:'Insulation type', f_ins_thick:'Insulation thickness',
      f_sqm:'Productivity (m²/labor·day)', f_labor:'Labor rate (TWD/labor·day)',
      f_naru:'Narulight (TWD/kg)', f_mc:'Aロフィックス MC (TWD/kg)',
      f_cork:'Cork plug (TWD/ea)', f_mortar:'Quick-set mortar (TWD/hole)',
      f_bit:'Drill bit (TWD/ea)', f_bitlife:'Bit lifetime (holes/bit)',
      f_nozzle:'Injection nozzle (TWD/ea)', f_nozzlelife:'Nozzle lifetime (holes/ea)',
      f_boric:'Boric acid & misc. (TWD/m²)', f_sundry:'Sundries (TWD/m²)',
      f_mgmt:'Site management (%)', f_profit:'G&A + profit (%)', f_tax:'VAT (%)',
      btn_recalc:'Recalculate / Refresh preview', btn_pdf:'Download Doc', btn_send:'Send copy to…', btn_contractor:'Download PDF (contractor) + open email', btn_client:'Download PDF (client) + open email',
      client_title:'Client submission — PDF + email',
      client_intro:'This will (1) save the quotation PDF, then (2) open your email client with a single-line lump-sum quotation (Materials + Labor) pre-filled in the body. No internal cost breakdown is shown, but the Grand Total matches the contractor record exactly.',
      client_default_subject:'Quotation — ',
      client_default_msg:'Dear Sir/Madam,\n\nPlease find our quotation for the captioned project below; the corresponding PDF is attached.',
      client_row_label:'Materials + Labor (lump sum)',
      client_row_spec:'project area, lump sum',
      contractor_title:'Contractor record — PDF + email',
      contractor_intro:'This will (1) save the standard quotation PDF, then (2) open your email client with the FULL internal cost breakdown (direct costs, overhead, profit, margins) pre-filled in the body. For internal/contractor record only — do not send to the client.',
      contractor_default_subject:'[INTERNAL] Quotation — ',
      contractor_default_msg:'Internal record. Full cost breakdown including direct costs, site management, G&A + profit, and gross margin follows below.',
      contractor_warn:'⚠ This message contains direct costs, gross margin and profit figures. DO NOT send to the client.',
      contractor_h_proj:'■ Project', contractor_h_mat:'■ Materials', contractor_h_cons:'■ Consumables', contractor_h_labor:'■ Labor', contractor_h_dc:'■ Direct cost subtotal', contractor_h_oh:'■ Overhead, profit & tax', contractor_h_margin:'■ Margin summary',
      contractor_margin_dc:'Direct cost', contractor_margin_total:'Pre-tax sell', contractor_margin_gp:'Gross profit (pre-tax sell − direct cost)', contractor_margin_pct:'Gross margin',
      send_title:'Send a copy of the quotation',
      send_intro:'This will (1) save the quotation as a PDF to your computer, then (2) open your email client with the message pre-filled. After the email opens, drag the saved PDF into it as an attachment.',
      send_to_label:'Recipient email', send_subject_label:'Subject', send_message_label:'Message',
      send_default_subject:'Quotation', send_default_msg:'Dear Sir / Madam,\nPlease find attached the quotation for your kind review and consideration.\n\nBest regards,',
      send_confirm:'Save PDF & open email', send_cancel:'Cancel',
      send_success:'PDF saved and email client opened. Please attach the PDF and send.', send_blocked:'Your browser blocked the email client from opening.',
      send_attach_filename:'Attachment filename', send_attach_hint:'⚠ Once your email opens, please drag the downloaded PDF below into the message as an attachment.',
      send_attach_inline:'>>> ATTACHMENT: please attach the PDF file named below <<<', send_step_pdf:'① Save the PDF (print dialog will open — choose “Save as PDF”)', send_step_mail:'② When the email opens, attach the saved PDF',
      q_title:'QUOTATION', q_to:'Attn.', q_subject:'Subject',
      q_below:'Dear Valued Client,\nWe sincerely thank you for your continued trust and for the opportunity to serve your project.\nWe are especially grateful that you have selected the Narulight Injection Method — the most advanced and environmentally responsible solution for the regeneration of damaged waterproofing layers — as your method of choice.\nWe are pleased to submit the following quotation for your kind review and consideration.',
      plan_title:'Floor Plan (S=N.T.S.)', plan_legend_hole:'Injection hole (φ8.5 × L80)', plan_legend_dim:'Dimension', plan_area:'Area', plan_holes:'Total holes', plan_pitch:'Pitch', plan_perim:'Perimeter',
      sec_title_a:'Cross-Section — A. Protected WP (no insulation)', sec_title_b:'Cross-Section — B. Protected WP + thermal insulation',
      sec_l_slab:'RC slab', sec_l_wp:'Existing waterproofing', sec_l_ins:'Thermal insulation', sec_l_prot:'Protective mortar / topping', sec_l_naru:'Narulight injection zone', sec_l_hole:'Injection hole φ8.5 × L80',
      tbl_no:'No.', tbl_item:'Item', tbl_spec:'Specification / Notes', tbl_qty:'Qty', tbl_unit:'Unit', tbl_price:'Unit price', tbl_amount:'Amount',
      sec_material:'Materials', sec_labor:'Labor', sec_consumables:'Consumables',
      row_naru:'Narulight injection material', row_mc:'Aロフィックス MC accelerator',
      row_cork:'Cork plug', row_mortar:'Quick-set mortar finishing',
      row_bit:'Hammer drill bit (10–12φ)', row_nozzle:'Injection nozzle',
      row_boric:'Boric acid spray, etc.', row_sundry:'Cleaning & site protection',
      row_labor:'Skilled labor on site', row_subtotal_dc:'Direct cost subtotal',
      row_mgmt:'Site management', row_profit:'G&A + profit', row_subtotal:'Subtotal (pre-tax)', row_tax:'VAT', row_total:'Grand total',
      ref_unit_price:'Equivalent unit price',
      notes_title:'Notes',
      notes:[
        '· Material consumption is auto-calculated from Narusekagaku Standard Application Manual (rev. 2019/6) and Design Price List (2024/10/1).',
        '· Actual injection quantity may increase depending on slab thickness, residual water, and joint conditions.',
        '· Scaffolding, waste disposal, electricity/water supply, and warranty terms are quoted separately.',
        '· This quotation is valid for 30 days from issue date.',
      ],
      sig_issuer:'Issued by', sig_recipient:'Received by',
      // === Method Statement i18n ===
      ms_title:'METHOD STATEMENT',
      ms_subtitle:'Narulight Injection Waterproof Layer Regeneration Method',
      ms_doc_no:'Document No.', ms_rev:'Revision', ms_date:'Issue date', ms_pages:'Page',
      ms_sec_project:'1. Project Information',
      ms_sec_scope:'2. Scope of Work',
      ms_sec_materials:'3. Materials & Equipment',
      ms_sec_procedure:'4. Application Procedure (8 Steps)',
      ms_sec_qaqc:'5. Quality Assurance / Quality Control',
      ms_sec_hse:'6. Health, Safety & Environment (HSE)',
      ms_sec_ppe:'7. Personal Protective Equipment (PPE)',
      ms_sec_drawings:'8. Shop Detail Drawings (Floor Plan & Cross-Section)',
      ms_sec_signoff:'9. Approval & Sign-Off',
      ms_pi_client:'Client', ms_pi_project:'Project', ms_pi_site:'Site address', ms_pi_date:'Issue date', ms_pi_quote:'Quotation No.',
      ms_pi_struct:'Roof structure', ms_pi_area:'Application area', ms_pi_lw:'Plan dimensions (L×W)', ms_pi_holes:'Planned injection holes', ms_pi_pitch:'Hole pitch',
      ms_scope_intro:'This Method Statement governs the following scope of work:',
      ms_scope_items:[
        'Pressure-injection of Narulight resin through the protective mortar / topping layer above the existing waterproofing.',
        'Regeneration / sealing of the deteriorated existing waterproof layer without removal, filling all leak paths in a continuous mass.',
        'Closure of injection holes with cork plug and quick-set mortar restoration to surface finish.',
      ],
      ms_qaqc_items:[
        'Pre- and post-application electrical resistance leak testing to verify disappearance of leak points.',
        'Recording of injection pressure (typ. 1.0–3.0 MPa) and per-hole consumption against the take-off table.',
        'On-site sample verification of non-toxic / non-flammable resin properties.',
        'All hole-seal locations shall be plugged with cork and finished flush with the surrounding surface.',
      ],
      ms_hse_items:[
        'All operatives to wear hard hat, safety eyewear, dust mask and gloves at all times.',
        'Hammer-drill cords to be inspected and used with RCD/GFCI protection.',
        'Narulight is non-toxic and non-flammable; contains no formaldehyde, toluene, xylene; ventilate enclosed work areas during application.',
        'Work area to be barricaded; entry restricted to authorised personnel.',
      ],
      ms_signoff_a:'Contractor representative', ms_signoff_b:'Site supervisor', ms_signoff_c:'Client representative', ms_sign_name:'Name', ms_sign_sig:'Signature', ms_sign_date:'Date',
      ms_step_purpose:'Purpose', ms_step_dur:'Duration', ms_step_tools:'Equipment', ms_step_check:'Checkpoint',
      ms_ppe_intro:'All site personnel shall wear the personal protective equipment (PPE) listed below. Equipment shall be verified against the check-list at the site entry control before each shift.',
      ms_ppe_item:'Item', ms_ppe_spec:'Specification', ms_ppe_purpose:'Purpose', ms_ppe_when:'Applicable step',
      ms_ppe_rows:[
        ['Hard hat', 'EN 397 / ANSI Z89.1 Type I', 'Head protection from falling objects and impact', 'All steps'],
        ['Safety eyewear / goggles', 'EN 166 (impact + dust)', 'Eye protection against drilling chips and resin splash', 'Step 02 · 06'],
        ['Dust mask', 'FFP2 / N95 or higher', 'Prevent inhalation of concrete drilling dust', 'Step 02 · 03'],
        ['Organic-vapour respirator (when needed)', 'EN 14387 Class A1 / OV cartridge', 'Resin-vapour protection in confined or poorly ventilated spaces', 'Step 04–06 (low ventilation)'],
        ['Work gloves', 'Solvent-resistant nitrile or leather', 'Hand protection against resin and tools', 'All steps'],
        ['Safety footwear', 'EN ISO 20345 S3 / ASTM F2413', 'Foot protection from impact and puncture', 'All steps'],
        ['Hearing protection', 'NRR ≥ 25 dB (ear plugs / muffs)', 'Reduce hammer-drill noise exposure (>85 dB)', 'Step 02'],
        ['High-visibility vest', 'EN ISO 20471 Class 2', 'Visibility from vehicles and other crews', 'Outdoor / night work'],
        ['Portable RCD / GFCI', '30 mA, instantaneous trip', 'Electric-shock prevention for power tools', 'Step 02 · 04 · 06'],
        ['Full-body fall-arrest harness', 'EN 361 / ANSI Z359.11', 'Fall protection at heights ≥ 2 m', 'Roof edge / parapet work'],
      ],
      ms_ppe_note:'Note: Narulight is a water-based resin and contains no formaldehyde, toluene or xylene (substances regulated by the Japanese Ministry of Health, Labour and Welfare guideline values). Maintain ventilation at all times; in confined spaces, provide forced mechanical ventilation.',
    },
    zh:{
      sec_label:'STEP 5 — 報價作業', sec_title:'自動報價產生系統',
      sec_sub:'輸入工地基本資料，系統依據原廠技術規範自動推算材料用量與工資，並產生 A4 預覽與 PDF 下載。',
      panel_company:'1. 報價發行公司（貴公司資料）',
      panel_client:'2. 客戶 / 專案資訊',
      panel_project:'3. 結構條件與施工因子',
      panel_costs:'4. 單價設定（材料 / 工資）',
      panel_overhead:'5. 管理費・利潤・稅金',
      panel_preview:'6. A4 報價單預覽',
      f_company:'公司名稱', f_logo:'公司商標', f_address:'地址', f_phone:'電話', f_email:'Email', f_taxid:'統一編號', f_contact:'聯絡人',
      f_client_name:'客戶名稱', f_project_name:'專案名稱', f_site:'施工地點', f_date:'發行日', f_quote_no:'報價單號',
      f_structure:'結構類別', f_area:'施工面積 (m²)', f_length:'長度 L (m)', f_width:'寬度 W (m)', f_shape:'平面形狀', f_thickness:'保護層厚度', f_pitch:'注入孔間距',
      f_ins_type:'隔熱材種類', f_ins_thick:'隔熱材厚度',
      f_sqm:'施工效率 (m²/人日)', f_labor:'工資單價 (TWD/人日)',
      f_naru:'Narulight 注入材 (TWD/kg)', f_mc:'Aロフィックス MC (TWD/kg)',
      f_cork:'木栓 (TWD/個)', f_mortar:'速凝水泥砂漿 (TWD/孔)',
      f_bit:'鑽頭 (TWD/支)', f_bitlife:'鑽頭壽命 (孔/支)',
      f_nozzle:'注入噴嘴 (TWD/個)', f_nozzlelife:'噴嘴壽命 (孔/個)',
      f_boric:'硼酸液等 (TWD/m²)', f_sundry:'雜支 (TWD/m²)',
      f_mgmt:'工地管理費 (%)', f_profit:'管銷利潤 (%)', f_tax:'營業稅 (%)',
      btn_recalc:'重新計算 / 更新預覽', btn_pdf:'下載施工計畫書', btn_send:'寄送副本…', btn_contractor:'下載 PDF（業者存查）+ 開啟郵件', btn_client:'下載 PDF（客戶用）+ 開啟郵件',
      client_title:'客戶提交用 PDF + 郵件',
      client_intro:'本動作將：(1) 儲存報價單 PDF，(2) 開啟郵件並於內文預先帶入「材料 + 工資一式」簡化報價。不顯示內部成本與利潤，但「總計」與業者存查版完全一致。',
      client_default_subject:'報價單 — ',
      client_default_msg:'您好，\n\n隨函補上本案報價單，明細如下，其 PDF 亦一併附上。',
      client_row_label:'材料 + 工資（一式）',
      client_row_spec:'報價面積一式',
      contractor_title:'業者存查用 PDF + 郵件',
      contractor_intro:'本動作將：(1) 儲存標準報價單 PDF，(2) 開啟郵件並於內文預先帶入「完整成本結構與利潤」明細（含直接成本、現場管理、管銷利潤、毛利）。供業者內部存查使用，請勿寄送給客戶。',
      contractor_default_subject:'【內部存查】報價單 — ',
      contractor_default_msg:'內部存查資料。本案完整成本結構、毛利明細如下。',
      contractor_warn:'⚠ 內含直接成本、毛利、利潤率等資訊，請勿寄送給客戶。',
      contractor_h_proj:'■ 案件資訊', contractor_h_mat:'■ 材料費', contractor_h_cons:'■ 消耗資材', contractor_h_labor:'■ 工資', contractor_h_dc:'■ 直接工程費 小計', contractor_h_oh:'■ 管理費、利潤、稅', contractor_h_margin:'■ 毛利彙總',
      contractor_margin_dc:'直接成本', contractor_margin_total:'稅前售價', contractor_margin_gp:'毛利（稅前售價−直接成本）', contractor_margin_pct:'毛利率',
      send_title:'寄送本報價單之副本',
      send_intro:'本動作將：(1) 將報價單儲存為 PDF 至您的電腦，(2) 開啟您的電子郵件程式並預先填入內文。郵件開啟後，請將剛才儲存的 PDF 拖入郵件中作為附件。',
      send_to_label:'收件信箱', send_subject_label:'主旨', send_message_label:'內文',
      send_default_subject:'報價單', send_default_msg:'敬啟者：\n茲附上本案之報價單，敬請　卓裁。\n\n敬祝　商安',
      send_confirm:'儲存 PDF 並開啟郵件', send_cancel:'取消',
      send_success:'PDF 已儲存，郵件程式已開啟。請附加 PDF 後寄出。', send_blocked:'您的瀏覽器已封鎖電子郵件程式的開啟。',
      send_attach_filename:'附件檔名', send_attach_hint:'⚠ 郵件開啟後，請將下載之 PDF 拖入郵件中作為附件。',
      send_attach_inline:'>>> 附件：請將下列檔名之 PDF 附加至本郵件 <<<', send_step_pdf:'① 儲存 PDF（將開啟列印對話框，請選擇「儲存為 PDF」）', send_step_mail:'② 郵件開啟後，將已儲存之 PDF 附加上去',
      q_title:'報　價　單', q_to:'  ', q_subject:'工程名稱',
      q_below:'敬啟者　　時序更迭，敬祝　貴公司鴻圖大展、業務昌隆。\n　承蒙　貴公司一向之厚愛與支持，謹致謝忱。\n　此次　貴公司於眾多工法中，特別選用本公司所引進最先進且最環保之防水層再生工法「Narulight 注入工法」，本公司深感榮幸並由衷感謝。\n　茲依　貴方需求，謹此提供以下報價，敬請　卓裁。',
      plan_title:'施工平面配置圖 (S=N.T.S.)', plan_legend_hole:'注入孔（φ8.5×L80）', plan_legend_dim:'尺寸', plan_area:'施工面積', plan_holes:'注入孔總數', plan_pitch:'孔距', plan_perim:'周長',
      sec_title_a:'剖面圖 — A. 保護防水（無隔熱層）', sec_title_b:'剖面圖 — B. 保護隔熱防水（含隔熱層）',
      sec_l_slab:'RC 樓板', sec_l_wp:'既有防水層', sec_l_ins:'隔熱層', sec_l_prot:'保護砂漿 / 面層', sec_l_naru:'Narulight 注入區', sec_l_hole:'注入孔 φ8.5 × L80',
      tbl_no:'項次', tbl_item:'項目', tbl_spec:'規格 / 說明', tbl_qty:'數量', tbl_unit:'單位', tbl_price:'單價', tbl_amount:'金額',
      sec_material:'材料費', sec_labor:'工資', sec_consumables:'消耗資材',
      row_naru:'Narulight 注入材', row_mc:'Aロフィックス MC（硬化促進劑）',
      row_cork:'木栓（軟木塞）', row_mortar:'速凝水泥砂漿封孔',
      row_bit:'震動鑽頭 (10–12φ)', row_nozzle:'注入噴嘴',
      row_boric:'硼酸液 / 其他', row_sundry:'雜支（清潔養護）',
      row_labor:'現場施工人員', row_subtotal_dc:'直接工程費 小計',
      row_mgmt:'工地管理費', row_profit:'管銷及利潤', row_subtotal:'稅前小計', row_tax:'營業稅', row_total:'總計',
      ref_unit_price:'單價換算',
      notes_title:'備註說明',
      notes:[
        '· 本報價依據成瀬化學株式會社《標準施工要領書》（2019/6 版）及《設計價格表》（2024/10/1）自動計算材料用量。',
        '· 視現場樓板厚度、內部殘留水量、伸縮縫狀況，注入量可能增加，將另行計列。',
        '· 仮設施工架、廢棄物處理、水電供給、保固年限另行協議。',
        '· 本報價有效期限：自發行日起 30 日內有效。',
      ],
      sig_issuer:'報價人', sig_recipient:'收件人',
      // === Method Statement i18n ===
      ms_title:'施工計畫書（METHOD STATEMENT）',
      ms_subtitle:'Narulight 注入防水層再生工法',
      ms_doc_no:'文件編號', ms_rev:'版次', ms_date:'發行日期', ms_pages:'頁次',
      ms_sec_project:'1. 工程概要',
      ms_sec_scope:'2. 作業範圍',
      ms_sec_materials:'3. 使用材料與設備',
      ms_sec_procedure:'4. 施工步驟（8 工程）',
      ms_sec_qaqc:'5. 品質管理 (QA / QC)',
      ms_sec_hse:'6. 健康、安全與環境 (HSE)',
      ms_sec_ppe:'7. 個人防護具 (PPE)',
      ms_sec_drawings:'8. 施工詳圖（平面圖與剖面圖）',
      ms_sec_signoff:'9. 核可與簽到',
      ms_pi_client:'業主', ms_pi_project:'案名', ms_pi_site:'工地地址', ms_pi_date:'發行日期', ms_pi_quote:'報價單號',
      ms_pi_struct:'防水構造', ms_pi_area:'施工面積', ms_pi_lw:'平面尺寸（L×W）', ms_pi_holes:'預計注入孔數', ms_pi_pitch:'孔距',
      ms_scope_intro:'本施工計畫書規範以下作業內容：',
      ms_scope_items:[
        '透過既有防水層上方之保護砂漿、面層加壓注入 Narulight 樹脂。',
        '不拆除原防水層，將劣化防水層再生 / 修補，並連續填充所有漏水路徑。',
        '注入完成後，以軟木栓及速凝砂漿封閉鈐孔與原面層齊平。',
      ],
      ms_qaqc_items:[
        '作業前後進行電位測試，驗證漏水點消失。',
        '記錄注入壓力（1.0～3.0 MPa）與每孔消耗量，對照取謜表。',
        '現場抽樣確認樹脂之無毒、不燃性質。',
        '所有封孔位置均需以軟木塞入，並與周遭面層齊平收面。',
      ],
      ms_hse_items:[
        '作業人員需全程佩戴安全帽、護目鏡、防塵口罩與手套。',
        '電銽電線需業主重並加裝漏電保護裝置。',
        'Narulight 為無毒、不燃性材料，不含甲醛、甲苯、二甲苯等有害物質，但在密閉空間作業仍需保持通風。',
        '作業區需設置隴離警示，僅限授權人員進入。',
      ],
      ms_signoff_a:'承包商代表', ms_signoff_b:'工地主任', ms_signoff_c:'業主代表', ms_sign_name:'姓名', ms_sign_sig:'簽名', ms_sign_date:'日期',
      ms_step_purpose:'目的', ms_step_dur:'作業時間', ms_step_tools:'使用設備', ms_step_check:'檢查點',
      ms_ppe_intro:'本工程所有作業人員均應穿戴下列個人防護具（PPE）。每班次入場前須依檢查表逐項核對裝備。',
      ms_ppe_item:'品項', ms_ppe_spec:'規格', ms_ppe_purpose:'用途', ms_ppe_when:'適用工序',
      ms_ppe_rows:[
        ['工地安全帽', 'CNS 1336 / EN 397', '保護頭部，防止落物與撞擊', '全工序'],
        ['安全護目鏡 / 護目罩', 'CNS 7177 / EN 166', '防止鑽孔粉塵與樹脂噴濺', '工序 02 · 06'],
        ['防塵口罩', 'CNS 14755 N95 / FFP2 以上', '預防混凝土粉塵吸入', '工序 02 · 03'],
        ['有機溶劑防毒口罩（必要時）', 'EN 14387 A1 / 有機氣體濾匣', '密閉或通風不良空間之樹脂蒸氣防護', '工序 04–06（通風不足時）'],
        ['工作手套', '耐溶劑丁腈手套 / 皮製手套', '保護手部免受樹脂與工具傷害', '全工序'],
        ['安全鞋', 'CNS 6863 S3 級', '防止落物撞擊與穿刺', '全工序'],
        ['聽力防護', '耳塞 / 耳罩 NRR ≥ 25 dB', '降低振動電鑽噪音（>85 dB）暴露', '工序 02'],
        ['高反光背心', 'CNS 15499 / EN ISO 20471 Class 2', '提升現場可見度，避免機具與人員碰撞', '室外或夜間作業'],
        ['漏電斷路器（行動式）', 'GFCI / 30 mA 瞬時跳脫', '使用電動工具時之觸電防護', '工序 02 · 04 · 06'],
        ['全身式防墜安全帶', 'CNS 7534 / EN 361', '高度 ≥ 2 m 之墜落防護', '屋頂邊緣 / 女兒牆周邊'],
      ],
      ms_ppe_note:'註：Narulight 為水性樹脂，不含甲醛、甲苯、二甲苯等日本厚生勞働省指針值列管物質。施工時仍應確保通風，於密閉空間內須以送風機進行強制通風。',
    },
  };

  // Alias 'ja' ⇄ 'jp' so code using either key works (Method Statement uses 'ja')
  T.ja = T.jp;
  Object.values(STRUCTURES).forEach(s => { if (s.jp && !s.ja) s.ja = s.jp; });

  function L(key){ return T[getLang()][key]; }

  // === DOM RENDER ===
  function buildSection(){
    const sec = document.createElement('section');
    sec.id = 'quotation';
    sec.className = 'quotation-section';
    sec.innerHTML = `
      <div class="container">
        <div class="section-label" id="qSecLabel"></div>
        <div class="section-title" id="qSecTitle"></div>
        <p class="section-sub" id="qSecSub"></p>

        <div class="q-grid">
          <div class="q-form">
            <div class="q-panel" id="qPanel-company"></div>
            <div class="q-panel" id="qPanel-client"></div>
            <div class="q-panel" id="qPanel-project"></div>
            <div class="q-panel" id="qPanel-costs"></div>
            <div class="q-panel" id="qPanel-overhead"></div>
            <div class="q-actions">
              <button id="qRecalc" class="btn btn-ghost"></button>
              <button id="qPdf" class="btn btn-primary"></button>
              <button id="qClient" class="btn btn-client"></button>
              <button id="qContractor" class="btn btn-contractor"></button>
            </div>
          </div>
          <div class="q-preview-wrap">
            <div class="q-preview-label" id="qPreviewLabel"></div>
            <div class="q-a4-frame">
              <div class="q-a4" id="qA4"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    return sec;
  }

  function buildPanels(){
    const lang = getLang();
    const opt = (arr, val, labelKey='label') => arr.map(o =>
      `<option value="${o.value}" ${(+o.value === +val) ? 'selected':''}>${o[labelKey] || o['label_'+lang]}</option>`
    ).join('');
    const optStruct = Object.entries(STRUCTURES).map(([k,v]) =>
      `<option value="${k}" ${k===STATE.project.structure?'selected':''}>${v[lang]||v.jp}</option>`
    ).join('');

    $('#qPanel-company').innerHTML = `
      <h4 class="q-panel-title">${L('panel_company')}</h4>
      <div class="q-fields">
        <label><span>${L('f_company')}</span><input type="text" data-bind="company.name" value="${STATE.company.name}" placeholder="史塔克工業 Stark Industries"></label>
        <label><span>${L('f_logo')}</span><input type="file" id="qLogo" accept="image/*"></label>
        <label class="q-full"><span>${L('f_address')}</span><input type="text" data-bind="company.address" value="${STATE.company.address}"></label>
        <label><span>${L('f_phone')}</span><input type="text" data-bind="company.phone" value="${STATE.company.phone}"></label>
        <label><span>${L('f_email')}</span><input type="text" data-bind="company.email" value="${STATE.company.email}"></label>
        <label><span>${L('f_taxid')}</span><input type="text" data-bind="company.tax_id" value="${STATE.company.tax_id}"></label>
        <label><span>${L('f_contact')}</span><input type="text" data-bind="company.contact" value="${STATE.company.contact}"></label>
      </div>
    `;

    $('#qPanel-client').innerHTML = `
      <h4 class="q-panel-title">${L('panel_client')}</h4>
      <div class="q-fields">
        <label><span>${L('f_client_name')}</span><input type="text" data-bind="client.name" value="${STATE.client.name}"></label>
        <label><span>${L('f_quote_no')}</span><input type="text" data-bind="client.quote_no" value="${STATE.client.quote_no}"></label>
        <label class="q-full"><span>${L('f_project_name')}</span><input type="text" data-bind="client.project" value="${STATE.client.project}"></label>
        <label class="q-full"><span>${L('f_site')}</span><input type="text" data-bind="client.site" value="${STATE.client.site}"></label>
        <label><span>${L('f_date')}</span><input type="date" data-bind="client.date" value="${STATE.client.date}"></label>
      </div>
    `;

    $('#qPanel-project').innerHTML = `
      <h4 class="q-panel-title">${L('panel_project')}</h4>
      <div class="q-fields">
        <label class="q-full"><span>${L('f_structure')} *</span>
          <select data-bind="project.structure" id="qStructureSel">${optStruct}</select>
        </label>
        <label><span>${L('f_area')} *</span><input type="number" min="1" step="1" data-bind="project.area_m2" id="qAreaInput" value="${STATE.project.area_m2}"></label>
        <label><span>${L('f_length')} *</span><input type="number" min="1" step="0.5" data-bind="project.length_m" id="qLenInput" value="${STATE.project.length_m}"></label>
        <label><span>${L('f_width')} *</span><input type="number" min="1" step="0.5" data-bind="project.width_m" id="qWidInput" value="${STATE.project.width_m}"></label>
        <label><span>${L('f_shape')}</span>
          <select data-bind="project.shape">
            <option value="rect" ${STATE.project.shape==='rect'?'selected':''}>${getLang()==='zh'?'矩形 Rectangle':getLang()==='en'?'Rectangle':'矩形 / Rectangle'}</option>
            <option value="L" ${STATE.project.shape==='L'?'selected':''}>${getLang()==='zh'?'L 形':getLang()==='en'?'L-shape':'L 形'}</option>
            <option value="U" ${STATE.project.shape==='U'?'selected':''}>${getLang()==='zh'?'U 形':getLang()==='en'?'U-shape':'U 形'}</option>
          </select>
        </label>
        <label><span>${L('f_thickness')}</span>
          <select data-bind="project.protection_thickness">${opt(PROTECTION_THICKNESS, STATE.project.protection_thickness)}</select>
        </label>
        <label class="q-ins-row"><span>${L('f_ins_type')}</span>
          <select data-bind="project.insulation_type">${INSULATION_TYPE.map(o=>`<option value="${o.value}" ${o.value===STATE.project.insulation_type?'selected':''}>${o['label_'+lang]||o.label_jp}</option>`).join('')}</select>
        </label>
        <label class="q-ins-row"><span>${L('f_ins_thick')}</span>
          <select data-bind="project.insulation_thickness">${opt(INSULATION_THICKNESS, STATE.project.insulation_thickness)}</select>
        </label>
        <label><span>${L('f_pitch')} *</span>
          <select data-bind="project.pitch_m">${opt(PITCH_OPTIONS, STATE.project.pitch_m)}</select>
        </label>
        <label><span>${L('f_sqm')}</span>
          <select data-bind="project.sqm_per_labor" data-also-input="qSqmManual">${opt(SQM_PER_LABOR, STATE.project.sqm_per_labor)}</select>
        </label>
        <label><span>　manual</span><input type="number" id="qSqmManual" min="1" step="0.5" data-bind="project.sqm_per_labor" value="${STATE.project.sqm_per_labor}"></label>
        <label><span>${L('f_labor')}</span>
          <select data-bind="project.labor_rate" data-also-input="qLaborManual">${LABOR_RATE_OPTIONS.map(o => `<option value="${o.value}" ${o.value===STATE.project.labor_rate?'selected':''}>${o.label}</option>`).join('')}</select>
        </label>
        <label><span>　manual</span><input type="number" id="qLaborManual" min="0" step="50" data-bind="project.labor_rate" value="${STATE.project.labor_rate}"></label>
      </div>
    `;

    const c = STATE.costs;
    $('#qPanel-costs').innerHTML = `
      <h4 class="q-panel-title">${L('panel_costs')}</h4>
      <div class="q-fields">
        <label><span>${L('f_naru')}</span><input type="number" min="0" step="1" data-bind="costs.naru_per_kg" value="${c.naru_per_kg}"></label>
        <label><span>${L('f_mc')}</span><input type="number" min="0" step="1" data-bind="costs.mc_per_kg" value="${c.mc_per_kg}"></label>
        <label><span>${L('f_cork')}</span><input type="number" min="0" step="1" data-bind="costs.cork_each" value="${c.cork_each}"></label>
        <label><span>${L('f_mortar')}</span><input type="number" min="0" step="1" data-bind="costs.mortar_per_hole" value="${c.mortar_per_hole}"></label>
        <label><span>${L('f_bit')}</span><input type="number" min="0" step="10" data-bind="costs.drill_bit_each" value="${c.drill_bit_each}"></label>
        <label><span>${L('f_bitlife')}</span><input type="number" min="1" step="1" data-bind="costs.drill_bit_lifetime_holes" value="${c.drill_bit_lifetime_holes}"></label>
        <label><span>${L('f_nozzle')}</span><input type="number" min="0" step="10" data-bind="costs.nozzle_each" value="${c.nozzle_each}"></label>
        <label><span>${L('f_nozzlelife')}</span><input type="number" min="1" step="1" data-bind="costs.nozzle_lifetime_holes" value="${c.nozzle_lifetime_holes}"></label>
        <label><span>${L('f_boric')}</span><input type="number" min="0" step="1" data-bind="costs.boric_acid_per_m2" value="${c.boric_acid_per_m2}"></label>
        <label><span>${L('f_sundry')}</span><input type="number" min="0" step="1" data-bind="costs.sundry_per_m2" value="${c.sundry_per_m2}"></label>
      </div>
    `;

    $('#qPanel-overhead').innerHTML = `
      <h4 class="q-panel-title">${L('panel_overhead')}</h4>
      <div class="q-fields">
        <label><span>${L('f_mgmt')}</span><input type="number" min="0" step="0.5" data-bind="project.management_pct" value="${STATE.project.management_pct}"></label>
        <label><span>${L('f_profit')}</span><input type="number" min="0" step="0.5" data-bind="project.profit_pct" value="${STATE.project.profit_pct}"></label>
        <label><span>${L('f_tax')}</span><input type="number" min="0" step="0.5" data-bind="project.tax_pct" value="${STATE.project.tax_pct}"></label>
      </div>
    `;

    $('#qSecLabel').textContent = L('sec_label');
    $('#qSecTitle').textContent = L('sec_title');
    $('#qSecSub').textContent = L('sec_sub');
    $('#qPreviewLabel').textContent = L('panel_preview');
    $('#qRecalc').textContent = L('btn_recalc');
    $('#qPdf').textContent = L('btn_pdf');
    $('#qClient').textContent = L('btn_client');
    $('#qContractor').textContent = L('btn_contractor');
  }

  function bindInputs(){
    $$('[data-bind]').forEach(el => {
      el.addEventListener('input', (e) => {
        const path = el.dataset.bind.split('.');
        let n = el.value;
        if(el.type==='number') n = parseFloat(n) || 0;
        STATE[path[0]][path[1]] = n;
        // Auto-calc area from L×W when shape is rect
        if(path[0]==='project' && (path[1]==='length_m' || path[1]==='width_m')){
          if(STATE.project.shape==='rect'){
            const a = Math.round((STATE.project.length_m||0) * (STATE.project.width_m||0));
            if(a>0){
              STATE.project.area_m2 = a;
              const ai = document.getElementById('qAreaInput');
              if(ai) ai.value = a;
            }
          }
        }
        // Sync paired select+manual inputs
        if(el.tagName==='SELECT' && el.dataset.alsoInput){
          const tw = document.getElementById(el.dataset.alsoInput);
          if(tw) tw.value = n;
        } else if(el.tagName==='INPUT' && el.type==='number'){
          const sib = $$(`[data-bind="${el.dataset.bind}"]`).find(x => x!==el && x.tagName==='SELECT');
          if(sib){
            const exists = [...sib.options].some(o => +o.value === +n);
            if(exists) sib.value = n;
          }
        }
        renderPreview();
      });
    });

    // Logo upload
    const logoInput = $('#qLogo');
    if(logoInput){
      logoInput.addEventListener('change', (e) => {
        const f = e.target.files[0];
        if(!f) return;
        const r = new FileReader();
        r.onload = () => { STATE.company.logo = r.result; renderPreview(); };
        r.readAsDataURL(f);
      });
    }

    $('#qRecalc').addEventListener('click', renderPreview);
    $('#qPdf').addEventListener('click', generateMethodStatement);
    $('#qClient').addEventListener('click', openClientDialog);
    $('#qContractor').addEventListener('click', openContractorDialog);
  }

  // === FLOOR PLAN SVG ===
  // Renders a to-scale floor plan with dimensions, injection-hole grid, and legend.
  // Auto-fits inside the canvas regardless of L:W aspect ratio.
  function buildFloorPlan(lang, tt){
    const p = STATE.project;
    const L = +p.length_m || 0;
    const W = +p.width_m || 0;
    const pitch = +p.pitch_m || 0.5;
    const shape = p.shape || 'rect';
    if(L<=0 || W<=0) return '';

    // Canvas: extra room around the plan so dimension labels don't clash with the legend
    const CW = 560, CH = 360;
    const padL = 80, padR = 28, padT = 32, padB = 100; // padB holds dim line + L label + legend stack
    const innerW = CW - padL - padR;
    const innerH = CH - padT - padB;
    const aspect = L / W;
    let drawW, drawH;
    if(innerW / innerH > aspect){
      drawH = innerH; drawW = innerH * aspect;
    } else {
      drawW = innerW; drawH = innerW / aspect;
    }
    const ox = padL + (innerW - drawW)/2;
    const oy = padT + (innerH - drawH)/2;
    // m → svg units
    const sx = drawW / L;
    const sy = drawH / W;

    // Outline path per shape
    let outline;
    if(shape==='L'){
      // L-shape: cut top-right quadrant (1/2 × 1/2)
      const cx = ox + drawW/2, cy = oy + drawH/2;
      outline = `M${ox},${oy} L${cx},${oy} L${cx},${cy} L${ox+drawW},${cy} L${ox+drawW},${oy+drawH} L${ox},${oy+drawH} Z`;
    } else if(shape==='U'){
      // U-shape: cut a rectangular notch from the top-center
      const nx1 = ox + drawW*0.30, nx2 = ox + drawW*0.70;
      const ny  = oy + drawH*0.55;
      outline = `M${ox},${oy} L${nx1},${oy} L${nx1},${ny} L${nx2},${ny} L${nx2},${oy} L${ox+drawW},${oy} L${ox+drawW},${oy+drawH} L${ox},${oy+drawH} Z`;
    } else {
      outline = `M${ox},${oy} L${ox+drawW},${oy} L${ox+drawW},${oy+drawH} L${ox},${oy+drawH} Z`;
    }

    // Injection hole grid — pitch × pitch, half-pitch inset from edges
    const holes = [];
    const inset = pitch/2;
    for(let y = inset; y < W; y += pitch){
      for(let x = inset; x < L; x += pitch){
        // Skip holes outside L/U cutouts
        if(shape==='L'){
          if(x > L/2 && y < W/2) continue;
        } else if(shape==='U'){
          if(x > L*0.30 && x < L*0.70 && y < W*0.55) continue;
        }
        holes.push({cx: ox + x*sx, cy: oy + y*sy});
      }
    }

    // Hole count + perimeter
    const holeCount = holes.length;
    let perim = 2*(L+W);
    if(shape==='L') perim = 2*(L+W); // same outer length
    if(shape==='U') perim = 2*(L+W) + 2*(W*0.45); // notch adds two vertical edges

    // Dimension labels
    const dimL = L.toFixed(1) + ' m';
    const dimW = W.toFixed(1) + ' m';
    const area = (+p.area_m2||0).toFixed(0);

    // North arrow
    const north = `
      <g transform="translate(${CW-32},${padT-4})">
        <polygon points="0,-12 4,4 0,1 -4,4" fill="#0a1525"/>
        <text x="0" y="14" text-anchor="middle" font-size="8" fill="#0a1525" font-weight="700">N</text>
      </g>`;

    // Dimension lines (horizontal at bottom, vertical at left)
    const dimYline = oy+drawH+26;
    const dimYtext = oy+drawH+44;
    const dim = `
      <g class="qa4-plan-dim" stroke="#0a1525" stroke-width="0.7" fill="#0a1525">
        <!-- horizontal (length) -->
        <line x1="${ox}" y1="${dimYline}" x2="${ox+drawW}" y2="${dimYline}"/>
        <line x1="${ox}" y1="${dimYline-4}" x2="${ox}" y2="${dimYline+4}"/>
        <line x1="${ox+drawW}" y1="${dimYline-4}" x2="${ox+drawW}" y2="${dimYline+4}"/>
        <text x="${ox+drawW/2}" y="${dimYtext}" text-anchor="middle" font-size="11" font-weight="600">L = ${dimL}</text>
        <!-- vertical (width) -->
        <line x1="${ox-30}" y1="${oy}" x2="${ox-30}" y2="${oy+drawH}"/>
        <line x1="${ox-34}" y1="${oy}" x2="${ox-26}" y2="${oy}"/>
        <line x1="${ox-34}" y1="${oy+drawH}" x2="${ox-26}" y2="${oy+drawH}"/>
        <text x="${ox-46}" y="${oy+drawH/2}" text-anchor="middle" font-size="11" font-weight="600" transform="rotate(-90 ${ox-46} ${oy+drawH/2})">W = ${dimW}</text>
      </g>`;

    // Pitch indicator (small bracket between two adjacent holes, top-left)
    let pitchInd = '';
    if(holes.length>=2){
      const h0 = holes[0], h1 = holes[1];
      if(Math.abs(h1.cy - h0.cy) < 0.1){
        pitchInd = `
          <g stroke="#c1272d" stroke-width="0.6" fill="#c1272d">
            <line x1="${h0.cx}" y1="${h0.cy-10}" x2="${h1.cx}" y2="${h0.cy-10}"/>
            <line x1="${h0.cx}" y1="${h0.cy-13}" x2="${h0.cx}" y2="${h0.cy-7}"/>
            <line x1="${h1.cx}" y1="${h0.cy-13}" x2="${h1.cx}" y2="${h0.cy-7}"/>
            <text x="${(h0.cx+h1.cx)/2}" y="${h0.cy-15}" text-anchor="middle" font-size="8" font-weight="600">${pitch.toFixed(2)}m</text>
          </g>`;
      }
    }

    const holesSvg = holes.map(h => `<circle cx="${h.cx}" cy="${h.cy}" r="1.6" fill="#c1272d" stroke="#7a1316" stroke-width="0.3"/>`).join('');

    // Legend (bottom — placed below the L dimension)
    const legend = `
      <g transform="translate(${padL},${CH-26})" font-size="10" fill="#0a1525">
        <circle cx="6" cy="-3" r="2" fill="#c1272d" stroke="#7a1316" stroke-width="0.3"/>
        <text x="14" y="0">${tt.plan_legend_hole}</text>
        <line x1="200" y1="-3" x2="222" y2="-3" stroke="#0a1525" stroke-width="0.7"/>
        <line x1="200" y1="-7" x2="200" y2="1" stroke="#0a1525" stroke-width="0.7"/>
        <line x1="222" y1="-7" x2="222" y2="1" stroke="#0a1525" stroke-width="0.7"/>
        <text x="228" y="0">${tt.plan_legend_dim}</text>
      </g>`;

    return `
      <div class="qa4-plan">
        <div class="qa4-plan-title">${tt.plan_title}</div>
        <svg viewBox="0 0 ${CW} ${CH}" xmlns="http://www.w3.org/2000/svg" class="qa4-plan-svg">
          <defs>
            <pattern id="qa4hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#dde6f1" stroke-width="1"/>
            </pattern>
          </defs>
          <path d="${outline}" fill="url(#qa4hatch)" stroke="#0a1525" stroke-width="1.4"/>
          ${holesSvg}
          ${pitchInd}
          ${dim}
          ${north}
          ${legend}
        </svg>
        <div class="qa4-plan-stats">
          <span><i>${tt.plan_area}:</i> ${area} m²</span>
          <span><i>${tt.plan_holes}:</i> ${holeCount.toLocaleString()} ea</span>
          <span><i>${tt.plan_pitch}:</i> ${pitch.toFixed(2)} m × ${pitch.toFixed(2)} m</span>
          <span><i>${tt.plan_perim}:</i> ${perim.toFixed(1)} m</span>
        </div>
      </div>`;
  }

  // === CROSS-SECTION DIAGRAM (matches selected structure type A vs B) ===
  function buildCrossSection(lang, tt){
    const p = STATE.project;
    const struct = p.structure || 'protect_no_insulation';
    // Only render for the two protected-WP types; skip for penetrate_thin/thick
    if(struct !== 'protect_no_insulation' && struct !== 'protect_with_insulation') return '';
    const isB = (struct === 'protect_with_insulation');
    const title = isB ? tt.sec_title_b : tt.sec_title_a;

    // Layer thicknesses (mm shown as labels; drawn schematically not to scale)
    const protMm = +p.protection_thickness || 100;
    const insMm  = isB ? (+p.insulation_thickness || 50) : 0;

    // Canvas
    const CW = 560, CH = 230;
    const padL = 110, padR = 200, padT = 28, padB = 36;
    const innerW = CW - padL - padR;
    const innerH = CH - padT - padB;

    // Layer stack from BOTTOM up: RC slab, existing WP, [insulation if B], protective topping (Naru zone)
    // Heights are visual weights (not real scale)
    const layers = [];
    layers.push({ key:'slab', label:tt.sec_l_slab, sub:'',                fill:'#9aa3ad', stroke:'#5a6470', h: 38 });
    layers.push({ key:'wp',   label:tt.sec_l_wp,   sub:'',                fill:'#3a3a3a', stroke:'#1a1a1a', h: 10 });
    if(isB){
      layers.push({ key:'ins', label:tt.sec_l_ins, sub:`${insMm} mm`,    fill:'#ffe9a8', stroke:'#caa44a', h: 28, hatch:'ins' });
    }
    layers.push({ key:'prot', label:tt.sec_l_prot, sub:`${protMm} mm`,   fill:'#e6dccb', stroke:'#9a8c70', h: 44, hatch:'mortar' });

    const totalH = layers.reduce((s,l)=>s+l.h, 0);
    // Scale layer heights to fit innerH
    const scale = innerH / totalH;
    let yCursor = padT + innerH; // bottom of stack
    const drawn = [];
    for(const lyr of layers){
      const h = lyr.h * scale;
      const y = yCursor - h;
      drawn.push({ ...lyr, y, h });
      yCursor = y;
    }

    const x0 = padL, x1 = padL + innerW;

    // Render each layer as a rectangle with optional pattern
    const layerRects = drawn.map(l => {
      const fill = l.hatch === 'mortar' ? 'url(#csMortar)' :
                   l.hatch === 'ins'    ? 'url(#csIns)' : l.fill;
      return `<rect x="${x0}" y="${l.y}" width="${innerW}" height="${l.h}" fill="${fill}" stroke="${l.stroke}" stroke-width="0.8"/>`;
    }).join('');

    // Naru injection arrow + zone highlight (overlays the protective topping layer)
    const protLayer = drawn.find(l=>l.key==='prot');
    const naruZone = `
      <rect x="${x0+2}" y="${protLayer.y+2}" width="${innerW-4}" height="${protLayer.h-4}"
            fill="none" stroke="#c1272d" stroke-width="1.2" stroke-dasharray="4 3"/>
      <text x="${x0+innerW/2}" y="${protLayer.y+protLayer.h/2+3}" text-anchor="middle"
            font-size="9" font-weight="700" fill="#c1272d">${tt.sec_l_naru}</text>`;

    // Injection holes (red dots inside protective topping)
    const holeY = protLayer.y + protLayer.h - 6;
    const holes = [];
    const holeSpacing = innerW / 8;
    for(let i=1; i<8; i++){
      const cx = x0 + i*holeSpacing;
      // hole shaft going down through prot layer (and insulation if B)
      const shaftBottom = isB ? drawn.find(l=>l.key==='ins').y + drawn.find(l=>l.key==='ins').h - 2
                              : drawn.find(l=>l.key==='wp').y + 2;
      holes.push(`<line x1="${cx}" y1="${protLayer.y+1}" x2="${cx}" y2="${shaftBottom}" stroke="#7a1316" stroke-width="0.7"/>`);
      holes.push(`<circle cx="${cx}" cy="${protLayer.y+2}" r="2" fill="#c1272d" stroke="#7a1316" stroke-width="0.4"/>`);
    }

    // Layer call-outs (right side leader lines + labels)
    const callouts = drawn.map((l, i) => {
      const cy = l.y + l.h/2;
      const labelX = x1 + 14;
      const subTxt = l.sub ? ` <tspan fill="#666" font-weight="400">(${l.sub})</tspan>` : '';
      return `
        <line x1="${x1}" y1="${cy}" x2="${labelX-4}" y2="${cy}" stroke="#0a1525" stroke-width="0.5"/>
        <circle cx="${x1}" cy="${cy}" r="1.6" fill="#0a1525"/>
        <text x="${labelX}" y="${cy+3}" font-size="9.5" fill="#0a1525" font-weight="600">${l.label}${subTxt}</text>`;
    }).join('');

    // Left-side total thickness dimension
    const topY = drawn[drawn.length-1].y;
    const botY = drawn[0].y + drawn[0].h;
    const totalMm = protMm + insMm; // visible "added layers" depth
    const dimX = padL - 22;
    const dimLeft = `
      <g stroke="#0a1525" stroke-width="0.6" fill="#0a1525">
        <line x1="${dimX}" y1="${topY}" x2="${dimX}" y2="${botY}"/>
        <line x1="${dimX-4}" y1="${topY}" x2="${dimX+4}" y2="${topY}"/>
        <line x1="${dimX-4}" y1="${botY}" x2="${dimX+4}" y2="${botY}"/>
        <text x="${dimX-8}" y="${(topY+botY)/2}" text-anchor="middle" font-size="9" font-weight="600"
              transform="rotate(-90 ${dimX-8} ${(topY+botY)/2})">~${totalMm} mm</text>
      </g>`;

    // Injection nozzle indicator from above
    const nozX = x0 + innerW * 0.5;
    const nozY = drawn[drawn.length-1].y - 4;
    const nozzle = `
      <g fill="#0a1525" stroke="#0a1525" stroke-width="0.6">
        <polygon points="${nozX-4},${nozY-14} ${nozX+4},${nozY-14} ${nozX+2},${nozY-2} ${nozX-2},${nozY-2}" fill="#0a1525"/>
        <line x1="${nozX}" y1="${nozY-2}" x2="${nozX}" y2="${nozY+2}" stroke-width="1.4"/>
        <text x="${nozX+8}" y="${nozY-6}" font-size="8" fill="#0a1525" font-weight="600">▼ ${tt.sec_l_hole}</text>
      </g>`;

    return `
      <div class="qa4-plan qa4-section">
        <div class="qa4-plan-title">${title}</div>
        <svg viewBox="0 0 ${CW} ${CH}" xmlns="http://www.w3.org/2000/svg" class="qa4-plan-svg">
          <defs>
            <pattern id="csMortar" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill="#e6dccb"/>
              <circle cx="1.5" cy="1.5" r="0.6" fill="#9a8c70"/>
              <circle cx="4.5" cy="4" r="0.5" fill="#9a8c70"/>
              <circle cx="3" cy="2.5" r="0.4" fill="#9a8c70"/>
            </pattern>
            <pattern id="csIns" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="#ffe9a8"/>
              <line x1="0" y1="0" x2="0" y2="8" stroke="#caa44a" stroke-width="0.6"/>
            </pattern>
          </defs>
          ${layerRects}
          ${naruZone}
          ${holes.join('')}
          ${nozzle}
          ${dimLeft}
          ${callouts}
        </svg>
      </div>`;
  }

  // === A4 PREVIEW ===
  // mode: 'full' (default — shows all material/consumable/labor/mgmt/profit lines, contractor & default)
  //       'client' (lump-sum simplified — single "Materials + Labor" line, hides margin)
  function renderPreview(mode){
    mode = mode || 'full';
    const r = compute();
    const lang = getLang();
    const co = STATE.company, cl = STATE.client, p = STATE.project;
    const t = T[lang];

    const logo = co.logo
      ? `<img src="${co.logo}" alt="logo" class="q-logo-img">`
      : `<div class="q-logo-placeholder">LOGO</div>`;

    const rowsHtml = [];
    let n = 1;
    const r2 = (label, spec, qty, unit, price, amount) => `
      <tr>
        <td class="c">${n++}</td>
        <td>${label}</td>
        <td class="spec">${spec}</td>
        <td class="r">${qty}</td>
        <td class="c">${unit}</td>
        <td class="r">${fmt(price)}</td>
        <td class="r">${fmt(amount)}</td>
      </tr>`;
    const sec = (label) => `<tr class="sec-row"><td colspan="7">${label}</td></tr>`;
    const tot = (label, val, cls='') => `
      <tr class="tot-row ${cls}">
        <td colspan="6" class="r">${label}</td>
        <td class="r">${fmt(val)}</td>
      </tr>`;

    if(mode === 'client'){
      // Single lump-sum line: qty (m²) × (subtotal_pre_tax / area) = subtotal_pre_tax
      const lumpUnit = r.A > 0 ? r.subtotal_pre_tax / r.A : 0;
      const lumpAmt  = r.subtotal_pre_tax;
      rowsHtml.push(r2(t.client_row_label, t.client_row_spec, r.A.toFixed(0), 'm²', lumpUnit, lumpAmt));
      rowsHtml.push(tot(t.row_subtotal_dc, lumpAmt));
      rowsHtml.push(tot(t.row_subtotal, r.subtotal_pre_tax));
      rowsHtml.push(tot(`${t.row_tax} (${p.tax_pct}%)`, r.tax));
      rowsHtml.push(tot(t.row_total, r.grand_total, 'grand'));
    } else {
    rowsHtml.push(sec(t.sec_material));
    rowsHtml.push(r2(t.row_naru, `4.6–9.2 kg/m² × ${r.A} m² × 1.05`, r.naru_kg.toFixed(1), 'kg', STATE.costs.naru_per_kg, r.naru_cost));
    rowsHtml.push(r2(t.row_mc, '15% wt., grout cement', r.mc_kg.toFixed(1), 'kg', STATE.costs.mc_per_kg, r.mc_cost));

    rowsHtml.push(sec(t.sec_consumables));
    rowsHtml.push(r2(t.row_cork, `pitch ${(p.pitch_m*1000)} mm grid`, r.cork_qty, 'pcs', STATE.costs.cork_each, r.cork_cost));
    rowsHtml.push(r2(t.row_mortar, `1 × per hole`, r.mortar_qty, 'hole', STATE.costs.mortar_per_hole, r.mortar_cost));
    rowsHtml.push(r2(t.row_bit, `${r.bitLife} holes/bit${r.isInsulated?' · ins.':''}`, r.drill_bits, 'pcs', STATE.costs.drill_bit_each, r.bit_cost));
    rowsHtml.push(r2(t.row_nozzle, `${r.isInsulated?'extended ':''}${STATE.costs.nozzle_lifetime_holes} holes/nozzle`, r.nozzles, 'pcs', r.nozzleUnit, r.nozzle_cost));
    rowsHtml.push(r2(t.row_boric, '', r.A, 'm²', STATE.costs.boric_acid_per_m2, r.boric_cost));
    rowsHtml.push(r2(t.row_sundry, '', r.A, 'm²', STATE.costs.sundry_per_m2, r.sundry_cost));

    rowsHtml.push(sec(t.sec_labor));
    rowsHtml.push(r2(t.row_labor, `${p.sqm_per_labor} m²/d, ${r.labor_days.toFixed(2)} d`, r.labor_days.toFixed(2), 'p·d', p.labor_rate, r.labor_cost));

    rowsHtml.push(tot(t.row_subtotal_dc, r.direct_cost));
    rowsHtml.push(tot(`${t.row_mgmt} (${p.management_pct}%)`, r.mgmt));
    rowsHtml.push(tot(`${t.row_profit} (${p.profit_pct}%)`, r.profit));
    rowsHtml.push(tot(t.row_subtotal, r.subtotal_pre_tax));
    rowsHtml.push(tot(`${t.row_tax} (${p.tax_pct}%)`, r.tax));
    rowsHtml.push(tot(t.row_total, r.grand_total, 'grand'));
    }

    $('#qA4').innerHTML = `
      <div class="qa4-header">
        <div class="qa4-issuer">
          ${logo}
          <div class="qa4-issuer-info">
            <div class="qa4-issuer-name">${co.name || '史塔克工業 Stark Industries'}</div>
            <div class="qa4-issuer-line">${co.address||''}</div>
            <div class="qa4-issuer-line">TEL: ${co.phone||'—'} &nbsp; ✉ ${co.email||'—'}</div>
            <div class="qa4-issuer-line">${co.tax_id?('統一編號 '+co.tax_id):''} ${co.contact?(' · '+co.contact):''}</div>
          </div>
        </div>
        <div class="qa4-title-block">
          <div class="qa4-title">${t.q_title}</div>
          <div class="qa4-meta">
            <div><span>${t.f_quote_no}</span><b>${cl.quote_no}</b></div>
            <div><span>${t.f_date}</span><b>${cl.date}</b></div>
          </div>
        </div>
      </div>

      <div class="qa4-client">
        <div class="qa4-client-name">${cl.name||'—'} <span class="qa4-honor">${t.q_to}</span></div>
        <div class="qa4-subject"><span>${t.q_subject}：</span><b>${cl.project || r.struct[lang] || r.struct.jp}</b></div>
        ${cl.site?`<div class="qa4-site">${cl.site}</div>`:''}
        <div class="qa4-greet">${t.q_below.split('\n').map(s=>`<p>${s}</p>`).join('')}</div>
      </div>

      ${buildFloorPlan(lang, t)}

      ${buildCrossSection(lang, t)}

      <table class="qa4-table">
        <thead>
          <tr>
            <th style="width:30px">${t.tbl_no}</th>
            <th style="width:130px">${t.tbl_item}</th>
            <th>${t.tbl_spec}</th>
            <th style="width:60px">${t.tbl_qty}</th>
            <th style="width:40px">${t.tbl_unit}</th>
            <th style="width:90px">${t.tbl_price}</th>
            <th style="width:110px">${t.tbl_amount}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join('')}
        </tbody>
      </table>

      <div class="qa4-summary">
        <div class="qa4-key">
          <div class="qa4-key-label">${r.struct[lang]||r.struct.jp} · ${r.A} m²</div>
          <div class="qa4-key-val">${fmt(r.grand_total)}</div>
          <div class="qa4-key-unit">${t.ref_unit_price}: ${fmt(r.unit_price)} / m²</div>
        </div>
      </div>

      <div class="qa4-notes">
        <div class="qa4-notes-title">${t.notes_title}</div>
        <ul>${t.notes.map(x=>`<li>${x}</li>`).join('')}</ul>
      </div>

      <div class="qa4-sigs">
        <div class="qa4-sig"><div class="qa4-sig-label">${t.sig_issuer}</div><div class="qa4-sig-line"></div></div>
        <div class="qa4-sig"><div class="qa4-sig-label">${t.sig_recipient}</div><div class="qa4-sig-line"></div></div>
      </div>

      <div class="qa4-footer">
        <div class="qa4-foot-note">${lang==='jp'?'本見積はメーカー成瀬化学㈱の標準施工要領書および設計価格表に基づき算出しています。':
          lang==='en'?'Based on Narusekagaku Co., Ltd. Standard Application Manual & 2024 Design Price List.':
          '本報價依成瀬化学株式會社之標準施工要領書與 2024 年設計價格表計算。'}</div>
        <div class="qa4-foot-row">
          <div class="qa4-foot-l">© ${new Date().getFullYear()} 好時新創有限公司 Good Startup Co., Ltd. · ${lang==='jp'?'成瀬化学株式会社 台湾認定販売店':lang==='zh'?'成瀬化學株式會社 台灣認定販売店':'Authorized Distributor in Taiwan for Narusekagaku Co., Ltd.'}</div>
          <div class="qa4-foot-r">01 / 01</div>
        </div>
      </div>
    `;
  }

  // === SEND COPY (mailto with editable recipient) ===
  // Persists last-used recipient in localStorage. Opens user's own mail client; nothing is sent
  // automatically and no data leaves the browser without an explicit user action.
  const SEND_TO_KEY = 'narulight_send_copy_to';
  function getDefaultRecipient(){
    return localStorage.getItem(SEND_TO_KEY) || '';
  }

  function buildPlainTextSummary(){
    const lang = getLang();
    const t = T[lang];
    const r = compute();
    const co = STATE.company, cl = STATE.client, p = STATE.project;
    const fmt = n => 'TWD ' + Math.round(n).toLocaleString();
    const lines = [];
    lines.push(`${t.q_title}  /  ${cl.quote_no || ''}`);
    lines.push(`${t.f_date}: ${cl.date || ''}`);
    lines.push('');
    lines.push(`${t.f_client_name}: ${cl.name || '-'}`);
    if(cl.project) lines.push(`${t.q_subject}: ${cl.project}`);
    if(cl.site)    lines.push(`${cl.site}`);
    lines.push('');
    lines.push(`${t.f_structure}: ${r.struct[lang] || r.struct.jp}`);
    lines.push(`${t.f_area}: ${(+p.area_m2||0).toFixed(0)} m²   ` +
               `${t.f_length}: ${(+p.length_m||0).toFixed(1)} m   ` +
               `${t.f_width}: ${(+p.width_m||0).toFixed(1)} m`);
    lines.push(`${t.f_pitch}: ${(+p.pitch_m||0).toFixed(2)} m`);
    lines.push('');
    lines.push('—'.repeat(40));
    lines.push(`${t.sec_subtotal||'Subtotal'}: ${fmt(r.subtotal)}`);
    lines.push(`${t.row_mgmt||t.f_mgmt}: ${fmt(r.mgmt_amt)}`);
    lines.push(`${t.row_profit||t.f_profit}: ${fmt(r.profit_amt)}`);
    lines.push(`${t.row_tax||t.f_tax}: ${fmt(r.tax_amt)}`);
    lines.push(`${t.total||'TOTAL'}: ${fmt(r.grand_total)}`);
    lines.push('—'.repeat(40));
    lines.push('');
    lines.push((co.name || 'Narulight') + (co.tel ? ' / TEL ' + co.tel : '') + (co.email ? ' / ' + co.email : ''));
    return lines.join('\n');
  }

  function openSendDialog(){
    const lang = getLang();
    const t = T[lang];
    const cl = STATE.client;

    // Remove existing dialog if any
    const existing = document.getElementById('qSendDialog');
    if(existing) existing.remove();

    // Predicted PDF filename (matches what the print dialog will suggest as <title>)
    const safeBase = (cl.quote_no || 'Quotation').replace(/[^A-Za-z0-9_\-]/g, '_');
    const pdfFilename = `${safeBase}_${(cl.project||'Quotation').replace(/[^A-Za-z0-9_\-]/g,'_')}.pdf`;

    const defaultSubject = `${t.send_default_subject} — ${cl.project || cl.quote_no || ''}`.trim();
    const attachLine = `\n\n${t.send_attach_inline}\n📎 ${pdfFilename}\n`;
    const defaultBody = `${t.send_default_msg}${attachLine}\n${'='.repeat(40)}\n${buildPlainTextSummary()}`;
    const defaultTo = getDefaultRecipient();

    const dlg = document.createElement('div');
    dlg.id = 'qSendDialog';
    dlg.className = 'q-send-overlay';
    dlg.innerHTML = `
      <div class="q-send-modal" role="dialog" aria-labelledby="qSendTitle">
        <div class="q-send-head">
          <h3 id="qSendTitle">${t.send_title}</h3>
          <button class="q-send-close" aria-label="Close">×</button>
        </div>
        <p class="q-send-intro">${t.send_intro}</p>
        <ol class="q-send-steps">
          <li>${t.send_step_pdf}</li>
          <li>${t.send_step_mail}</li>
        </ol>
        <label class="q-send-field">
          <span>${t.send_to_label} *</span>
          <input type="email" id="qSendTo" value="${defaultTo}" placeholder="recipient@example.com" autocomplete="email" required>
        </label>
        <label class="q-send-field">
          <span>${t.send_subject_label}</span>
          <input type="text" id="qSendSubject" value="${defaultSubject.replace(/"/g,'&quot;')}">
        </label>
        <label class="q-send-field">
          <span>${t.send_attach_filename}</span>
          <input type="text" id="qSendFilename" value="${pdfFilename}" readonly>
        </label>
        <p class="q-send-attach-hint">${t.send_attach_hint}</p>
        <label class="q-send-field">
          <span>${t.send_message_label}</span>
          <textarea id="qSendMessage" rows="10">${defaultBody}</textarea>
        </label>
        <div class="q-send-actions">
          <button class="btn btn-ghost" id="qSendCancel">${t.send_cancel}</button>
          <button class="btn btn-primary" id="qSendConfirm">${t.send_confirm}</button>
        </div>
        <div class="q-send-status" id="qSendStatus" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(dlg);

    const close = () => dlg.remove();
    dlg.querySelector('.q-send-close').addEventListener('click', close);
    dlg.querySelector('#qSendCancel').addEventListener('click', close);
    dlg.addEventListener('click', (e) => { if(e.target === dlg) close(); });

    dlg.querySelector('#qSendConfirm').addEventListener('click', () => {
      const to = dlg.querySelector('#qSendTo').value.trim();
      const subject = dlg.querySelector('#qSendSubject').value;
      const body = dlg.querySelector('#qSendMessage').value;
      const status = dlg.querySelector('#qSendStatus');
      if(!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)){
        status.textContent = '⚠ ' + t.send_to_label;
        status.className = 'q-send-status err';
        return;
      }
      try { localStorage.setItem(SEND_TO_KEY, to); } catch(e){}

      // Step 1: trigger PDF save (opens print dialog in a new window)
      try { generatePDF(); } catch(e){ console.warn('PDF generation failed:', e); }

      // Step 2: open mail client after a short delay so the print window registers first
      setTimeout(() => {
        const url = 'mailto:' + encodeURIComponent(to) +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(body);
        window.location.href = url;
        status.textContent = '✓ ' + t.send_success;
        status.className = 'q-send-status ok';
        setTimeout(close, 2500);
      }, 800);
    });

    setTimeout(() => {
      const inp = dlg.querySelector('#qSendTo');
      if(inp){ inp.focus(); inp.select(); }
    }, 50);
  }

  // === CLIENT-FACING EMAIL ===
  // Lump-sum quotation. Hides materials/labor/mgmt/profit breakdown but Grand Total
  // matches the contractor record exactly. Recipient empty each time, not persisted.
  function buildClientPlainText(){
    const lang = getLang();
    const t = T[lang];
    const r = compute();
    const co = STATE.company, cl = STATE.client, p = STATE.project;
    const fmt = n => 'TWD ' + Math.round(n).toLocaleString();
    const pad = (s, w) => { s = String(s); return s + ' '.repeat(Math.max(0, w - s.length)); };
    const padR = (s, w) => { s = String(s); return ' '.repeat(Math.max(0, w - s.length)) + s; };
    const HR = '─'.repeat(64);
    const HR2 = '═'.repeat(64);
    const lines = [];

    // Header
    lines.push(HR2);
    lines.push(`  ${t.q_title || 'QUOTATION'}`);
    lines.push(`  ${cl.quote_no || ''}    ${cl.date || ''}`);
    lines.push(HR2);
    lines.push('');

    // Project info
    lines.push(`  ${t.f_client_name||'Client'}      : ${cl.name || '-'}`);
    if(cl.project) lines.push(`  ${t.q_subject||'Project'}     : ${cl.project}`);
    if(cl.site)    lines.push(`  ${t.f_site||'Site'}        : ${cl.site}`);
    lines.push(`  ${t.f_structure}   : ${r.struct[lang] || r.struct.jp}`);
    lines.push(`  ${t.f_area}        : ${(+p.area_m2||0).toFixed(0)} m²` +
               `   (L ${(+p.length_m||0).toFixed(1)} × W ${(+p.width_m||0).toFixed(1)} m)`);
    lines.push('');

    // Single line item — qty × unit price = pre-tax sell (subtotal_pre_tax)
    // unit price absorbs materials + labor + management + profit
    const qty = r.A;
    const unit = qty > 0 ? r.subtotal_pre_tax / qty : 0;
    const amt  = r.subtotal_pre_tax;

    const head = `  ${pad(t.tbl_item||'Item', 28)}${pad(t.tbl_spec||'Spec', 18)}${padR(t.tbl_qty||'Qty', 8)} ${pad(t.tbl_unit||'Unit', 5)}${padR(t.tbl_price||'Unit price', 14)}${padR(t.tbl_amount||'Amount', 14)}`;
    lines.push(head);
    lines.push(HR);
    lines.push(`  ${pad(t.client_row_label, 28)}${pad(t.client_row_spec, 18)}${padR(qty.toFixed(0), 8)} ${pad('m²', 5)}${padR('TWD ' + Math.round(unit).toLocaleString(), 14)}${padR(fmt(amt), 14)}`);
    lines.push(HR);
    lines.push('');

    // Totals
    const totRow = (label, value) => `  ${pad(label, 60)}${padR(fmt(value), 14)}`;
    lines.push(totRow(t.row_subtotal_dc, r.direct_cost_visible_for_client_unused || r.subtotal_pre_tax));
    // ↑ "Direct cost subtotal" line shows the same amount as the single line item.
    // We deliberately label it row_subtotal_dc (per spec) — it equals subtotal_pre_tax internally.
    lines.push(totRow(t.row_subtotal, r.subtotal_pre_tax));
    lines.push(totRow(`${t.row_tax} (${p.tax_pct}%)`, r.tax));
    lines.push(HR);
    lines.push(`  ${pad((t.row_total||'GRAND TOTAL').toUpperCase(), 60)}${padR(fmt(r.grand_total), 14)}`);
    lines.push('');
    lines.push(`  ${t.ref_unit_price||'Unit price'}: TWD ${Math.round(r.grand_total / r.A).toLocaleString()} /m² (incl. VAT)`);
    lines.push('');
    lines.push(HR2);
    lines.push(`  ${co.name || 'Narulight'}` + (co.tel ? '   TEL ' + co.tel : '') + (co.email ? '   ' + co.email : ''));
    lines.push(HR2);
    return lines.join('\n');
  }

  function openClientDialog(){
    const lang = getLang();
    const t = T[lang];
    const cl = STATE.client;

    const existing = document.getElementById('qClientDialog');
    if(existing) existing.remove();

    const safeBase = (cl.quote_no || 'Quotation').replace(/[^A-Za-z0-9_\-]/g, '_');
    const pdfFilename = `${safeBase}_${(cl.project||'Quotation').replace(/[^A-Za-z0-9_\-]/g,'_')}.pdf`;

    const defaultSubject = `${t.client_default_subject}${cl.quote_no || ''}${cl.project ? ' ('+cl.project+')' : ''}`.trim();
    const breakdown = buildClientPlainText();
    const defaultBody = `${t.client_default_msg}\n\n${breakdown}\n\n📎 ${t.send_attach_inline}: ${pdfFilename}`;

    const dlg = document.createElement('div');
    dlg.id = 'qClientDialog';
    dlg.className = 'q-send-overlay';
    dlg.innerHTML = `
      <div class="q-send-modal q-client-modal" role="dialog" aria-labelledby="qClientTitle">
        <div class="q-send-head">
          <h3 id="qClientTitle">${t.client_title}</h3>
          <button class="q-send-close" aria-label="Close">×</button>
        </div>
        <p class="q-send-intro">${t.client_intro}</p>
        <ol class="q-send-steps">
          <li>${t.send_step_pdf}</li>
          <li>${t.send_step_mail}</li>
        </ol>
        <label class="q-send-field">
          <span>${t.send_to_label} *</span>
          <input type="email" id="qClientTo" value="" placeholder="client@example.com" autocomplete="off" required>
        </label>
        <label class="q-send-field">
          <span>${t.send_subject_label}</span>
          <input type="text" id="qClientSubject" value="${defaultSubject.replace(/"/g,'&quot;')}">
        </label>
        <label class="q-send-field">
          <span>${t.send_attach_filename}</span>
          <input type="text" id="qClientFilename" value="${pdfFilename}" readonly>
        </label>
        <label class="q-send-field">
          <span>${t.send_message_label}</span>
          <textarea id="qClientMessage" rows="16">${defaultBody}</textarea>
        </label>
        <div class="q-send-actions">
          <button class="btn btn-ghost" id="qClientCancel">${t.send_cancel}</button>
          <button class="btn btn-client" id="qClientConfirm">${t.send_confirm}</button>
        </div>
        <div class="q-send-status" id="qClientStatus" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(dlg);

    const close = () => dlg.remove();
    dlg.querySelector('.q-send-close').addEventListener('click', close);
    dlg.querySelector('#qClientCancel').addEventListener('click', close);
    dlg.addEventListener('click', (e) => { if(e.target === dlg) close(); });

    dlg.querySelector('#qClientConfirm').addEventListener('click', () => {
      const to = dlg.querySelector('#qClientTo').value.trim();
      const subject = dlg.querySelector('#qClientSubject').value;
      const body = dlg.querySelector('#qClientMessage').value;
      const status = dlg.querySelector('#qClientStatus');
      if(!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)){
        status.textContent = '⚠ ' + t.send_to_label;
        status.className = 'q-send-status err';
        return;
      }
      try { generatePDF('client'); } catch(e){ console.warn('PDF generation failed:', e); }
      setTimeout(() => {
        const url = 'mailto:' + encodeURIComponent(to) +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(body);
        window.location.href = url;
        status.textContent = '✓ ' + t.send_success;
        status.className = 'q-send-status ok';
        setTimeout(close, 2500);
      }, 800);
    });

    setTimeout(() => {
      const inp = dlg.querySelector('#qClientTo');
      if(inp){ inp.focus(); }
    }, 50);
  }

  // === CONTRACTOR INTERNAL EMAIL ===
  // Full cost breakdown including direct costs, overhead, profit and margin.
  // Recipient is intentionally empty each time — typed by user, never persisted.
  function buildContractorPlainText(){
    const lang = getLang();
    const t = T[lang];
    const r = compute();
    const co = STATE.company, cl = STATE.client, p = STATE.project;
    const cs = STATE.costs;
    const fmt = n => 'TWD ' + Math.round(n).toLocaleString();
    const pad = (s, w) => { s = String(s); return s + ' '.repeat(Math.max(0, w - s.length)); };
    const padR = (s, w) => { s = String(s); return ' '.repeat(Math.max(0, w - s.length)) + s; };
    const HR = '─'.repeat(64);
    const HR2 = '═'.repeat(64);
    const lines = [];

    // Header
    lines.push(HR2);
    lines.push(`  ${t.contractor_title}`);
    lines.push(`  ${cl.quote_no || ''}    ${cl.date || ''}`);
    lines.push(HR2);
    lines.push('');
    lines.push(t.contractor_warn);
    lines.push('');

    // Project section
    lines.push(t.contractor_h_proj);
    lines.push(HR);
    lines.push(`  ${t.f_client_name||'Client'}      : ${cl.name || '-'}`);
    if(cl.project) lines.push(`  ${t.q_subject||'Project'}     : ${cl.project}`);
    if(cl.site)    lines.push(`  ${t.f_site||'Site'}        : ${cl.site}`);
    lines.push(`  ${t.f_structure}   : ${r.struct[lang] || r.struct.jp}`);
    lines.push(`  ${t.f_area}        : ${(+p.area_m2||0).toFixed(0)} m²` +
               `   (L ${(+p.length_m||0).toFixed(1)} × W ${(+p.width_m||0).toFixed(1)} m)`);
    lines.push(`  ${t.f_pitch}       : ${(+p.pitch_m||0).toFixed(2)} m   (${r.holes} holes total)`);
    lines.push('');

    // Line-item helper
    const row = (label, spec, qty, unit, price, amt) => {
      const lbl = pad(label, 32);
      const sp  = pad(spec || '', 22);
      const q   = padR(qty, 8);
      const u   = pad(unit, 5);
      const pr  = padR('TWD ' + Math.round(price).toLocaleString(), 12);
      const am  = padR(fmt(amt), 14);
      return `  ${lbl}${sp} ${q} ${u}${pr} ${am}`;
    };
    const totRow = (label, amt) => {
      return `  ${pad(label, 60)}${padR(fmt(amt), 14)}`;
    };

    // Materials
    lines.push(t.contractor_h_mat);
    lines.push(HR);
    lines.push(row(t.row_naru, `${r.naru_kg.toFixed(1)} kg`, r.naru_kg.toFixed(1), 'kg', cs.naru_per_kg, r.naru_cost));
    lines.push(row(t.row_mc,   '15% wt.',                     r.mc_kg.toFixed(1),   'kg', cs.mc_per_kg,   r.mc_cost));
    lines.push('');

    // Consumables
    lines.push(t.contractor_h_cons);
    lines.push(HR);
    lines.push(row(t.row_cork,   `pitch ${(p.pitch_m*1000)} mm`, r.cork_qty,    'pcs',  cs.cork_each,        r.cork_cost));
    lines.push(row(t.row_mortar, '1×/hole',                       r.mortar_qty,  'hole', cs.mortar_per_hole,  r.mortar_cost));
    lines.push(row(t.row_bit,    `${r.bitLife} h/bit`,            r.drill_bits,  'pcs',  cs.drill_bit_each,   r.bit_cost));
    lines.push(row(t.row_nozzle, `${cs.nozzle_lifetime_holes} h/noz`, r.nozzles, 'pcs',  r.nozzleUnit,         r.nozzle_cost));
    lines.push(row(t.row_boric,  '',                              r.A,           'm²',   cs.boric_acid_per_m2, r.boric_cost));
    lines.push(row(t.row_sundry, '',                              r.A,           'm²',   cs.sundry_per_m2,    r.sundry_cost));
    lines.push(`  ${pad('  → Materials + Consumables subtotal', 60)}${padR(fmt(r.material_subtotal), 14)}`);
    lines.push('');

    // Labor
    lines.push(t.contractor_h_labor);
    lines.push(HR);
    lines.push(row(t.row_labor, `${p.sqm_per_labor} m²/d`, r.labor_days.toFixed(2), 'p·d', p.labor_rate, r.labor_cost));
    lines.push('');

    // Direct cost
    lines.push(t.contractor_h_dc);
    lines.push(HR);
    lines.push(totRow(t.row_subtotal_dc, r.direct_cost));
    lines.push('');

    // Overhead, profit, tax
    lines.push(t.contractor_h_oh);
    lines.push(HR);
    lines.push(totRow(`${t.row_mgmt} (${p.management_pct}%)`,  r.mgmt));
    lines.push(totRow(`${t.row_profit} (${p.profit_pct}%)`,    r.profit));
    lines.push(totRow(t.row_subtotal,                           r.subtotal_pre_tax));
    lines.push(totRow(`${t.row_tax} (${p.tax_pct}%)`,           r.tax));
    lines.push(HR);
    lines.push(`  ${pad(t.row_total.toUpperCase(), 60)}${padR(fmt(r.grand_total), 14)}`);
    lines.push('');

    // Margin summary
    const grossProfit = r.subtotal_pre_tax - r.direct_cost;
    const grossMarginPct = r.subtotal_pre_tax > 0 ? (grossProfit / r.subtotal_pre_tax) * 100 : 0;
    const markupPct = r.direct_cost > 0 ? (grossProfit / r.direct_cost) * 100 : 0;
    lines.push(t.contractor_h_margin);
    lines.push(HR);
    lines.push(totRow(t.contractor_margin_dc,    r.direct_cost));
    lines.push(totRow(t.contractor_margin_total, r.subtotal_pre_tax));
    lines.push(totRow(t.contractor_margin_gp,    grossProfit));
    lines.push(`  ${pad(t.contractor_margin_pct, 60)}${padR(grossMarginPct.toFixed(1) + ' %', 14)}`);
    lines.push(`  ${pad('  Markup on direct cost', 60)}${padR(markupPct.toFixed(1) + ' %', 14)}`);
    lines.push(`  ${pad(t.ref_unit_price||'Unit price', 60)}${padR('TWD ' + Math.round(r.unit_price).toLocaleString() + ' /m²', 14)}`);
    lines.push('');
    lines.push(HR2);
    lines.push(`  ${co.name || 'Narulight'}` + (co.tel ? '   TEL ' + co.tel : '') + (co.email ? '   ' + co.email : ''));
    lines.push(HR2);
    return lines.join('\n');
  }

  function openContractorDialog(){
    const lang = getLang();
    const t = T[lang];
    const cl = STATE.client;

    const existing = document.getElementById('qContractorDialog');
    if(existing) existing.remove();

    const safeBase = (cl.quote_no || 'Quotation').replace(/[^A-Za-z0-9_\-]/g, '_');
    const pdfFilename = `${safeBase}_${(cl.project||'Quotation').replace(/[^A-Za-z0-9_\-]/g,'_')}.pdf`;

    const defaultSubject = `${t.contractor_default_subject}${cl.quote_no || ''}${cl.project ? ' ('+cl.project+')' : ''}`.trim();
    const breakdown = buildContractorPlainText();
    const defaultBody = `${t.contractor_default_msg}\n\n${breakdown}\n\n📎 ${t.send_attach_inline}: ${pdfFilename}`;

    const dlg = document.createElement('div');
    dlg.id = 'qContractorDialog';
    dlg.className = 'q-send-overlay';
    dlg.innerHTML = `
      <div class="q-send-modal q-contractor-modal" role="dialog" aria-labelledby="qContractorTitle">
        <div class="q-send-head">
          <h3 id="qContractorTitle">${t.contractor_title}</h3>
          <button class="q-send-close" aria-label="Close">×</button>
        </div>
        <p class="q-send-intro">${t.contractor_intro}</p>
        <div class="q-contractor-warn">${t.contractor_warn}</div>
        <ol class="q-send-steps">
          <li>${t.send_step_pdf}</li>
          <li>${t.send_step_mail}</li>
        </ol>
        <label class="q-send-field">
          <span>${t.send_to_label} *</span>
          <input type="email" id="qContrTo" value="" placeholder="internal@your-company.com" autocomplete="off" required>
        </label>
        <label class="q-send-field">
          <span>${t.send_subject_label}</span>
          <input type="text" id="qContrSubject" value="${defaultSubject.replace(/"/g,'&quot;')}">
        </label>
        <label class="q-send-field">
          <span>${t.send_attach_filename}</span>
          <input type="text" id="qContrFilename" value="${pdfFilename}" readonly>
        </label>
        <label class="q-send-field">
          <span>${t.send_message_label}</span>
          <textarea id="qContrMessage" rows="18">${defaultBody}</textarea>
        </label>
        <div class="q-send-actions">
          <button class="btn btn-ghost" id="qContrCancel">${t.send_cancel}</button>
          <button class="btn btn-contractor" id="qContrConfirm">${t.send_confirm}</button>
        </div>
        <div class="q-send-status" id="qContrStatus" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(dlg);

    const close = () => dlg.remove();
    dlg.querySelector('.q-send-close').addEventListener('click', close);
    dlg.querySelector('#qContrCancel').addEventListener('click', close);
    dlg.addEventListener('click', (e) => { if(e.target === dlg) close(); });

    dlg.querySelector('#qContrConfirm').addEventListener('click', () => {
      const to = dlg.querySelector('#qContrTo').value.trim();
      const subject = dlg.querySelector('#qContrSubject').value;
      const body = dlg.querySelector('#qContrMessage').value;
      const status = dlg.querySelector('#qContrStatus');
      if(!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)){
        status.textContent = '⚠ ' + t.send_to_label;
        status.className = 'q-send-status err';
        return;
      }
      // Step 1: PDF
      try { generatePDF(); } catch(e){ console.warn('PDF generation failed:', e); }
      // Step 2: open mail client
      setTimeout(() => {
        const url = 'mailto:' + encodeURIComponent(to) +
                    '?subject=' + encodeURIComponent(subject) +
                    '&body=' + encodeURIComponent(body);
        window.location.href = url;
        status.textContent = '✓ ' + t.send_success;
        status.className = 'q-send-status ok';
        setTimeout(close, 2500);
      }, 800);
    });

    setTimeout(() => {
      const inp = dlg.querySelector('#qContrTo');
      if(inp){ inp.focus(); }
    }, 50);
  }

  // === PDF GENERATION ===
  function generatePDF(mode){
    mode = mode || 'full';
    // Re-render A4 in requested mode so the printed PDF matches the email body
    if(mode === 'client'){ renderPreview('client'); }
    const a4 = $('#qA4');
    if(!a4){
      if(mode === 'client') renderPreview('full');
      return;
    }

    // Open print window with cloned A4
    const w = window.open('', '_blank', 'width=900,height=1100');
    if(!w){
      alert('Please allow pop-ups to download the PDF.');
      return;
    }
    const styles = `
      <style>
        *{box-sizing:border-box;}
        body{margin:0;padding:0;font-family:'Noto Sans TC','Noto Sans JP','Inter',Arial,sans-serif;color:#0a1525;background:#fff;font-size:11px;line-height:1.45;}
        @page { size: A4; margin: 12mm; }
        .qa4{width:186mm;}
        .qa4-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0a1525;padding-bottom:10px;margin-bottom:14px;}
        .qa4-issuer{display:flex;gap:12px;align-items:center;}
        .q-logo-img{max-height:50px;max-width:120px;object-fit:contain;}
        .q-logo-placeholder{width:80px;height:50px;border:1px dashed #888;display:flex;align-items:center;justify-content:center;font-size:10px;color:#888;letter-spacing:2px;}
        .qa4-issuer-name{font-weight:700;font-size:13px;margin-bottom:2px;}
        .qa4-issuer-line{font-size:10px;color:#444;}
        .qa4-title-block{text-align:right;}
        .qa4-title{font-size:24px;font-weight:800;letter-spacing:6px;margin-bottom:6px;}
        .qa4-meta{font-size:10px;color:#444;}
        .qa4-meta div{margin-bottom:2px;}
        .qa4-meta span{margin-right:6px;color:#888;}
        .qa4-meta b{color:#0a1525;}
        .qa4-client{margin-bottom:10px;border-bottom:1px solid #ddd;padding-bottom:8px;}
        .qa4-client-name{font-size:14px;font-weight:600;margin-bottom:4px;}
        .qa4-honor{font-size:11px;font-weight:400;color:#666;margin-left:6px;}
        .qa4-subject{font-size:11px;color:#444;}
        .qa4-subject b{color:#0a1525;}
        .qa4-site{font-size:10px;color:#666;margin-top:2px;}
        .qa4-greet{font-size:10px;color:#444;margin-top:8px;line-height:1.55;}
        .qa4-greet p{margin:0 0 3px;}
        .qa4-greet p:first-child{font-weight:600;color:#0a1525;}
        .qa4-plan{margin:8px 0 12px;border:1px solid #ddd;border-radius:4px;padding:8px 10px;background:#fafbfc;page-break-inside:avoid;}
        .qa4-plan-title{font-size:10px;font-weight:700;color:#0a1525;letter-spacing:1px;margin-bottom:4px;text-transform:uppercase;}
        .qa4-plan-svg{width:100%;height:auto;display:block;background:#fff;border:1px solid #e8edf3;}
        .qa4-plan-stats{display:flex;gap:14px;flex-wrap:wrap;font-size:9px;color:#444;margin-top:5px;padding-top:5px;border-top:1px dashed #ddd;}
        .qa4-plan-stats i{font-style:normal;color:#888;margin-right:3px;}
        .qa4-plan-stats b,.qa4-plan-stats span b{color:#0a1525;font-weight:600;}
        .qa4-table{width:100%;border-collapse:collapse;margin-bottom:10px;}
        .qa4-table th{background:#0a1525;color:#fff;padding:6px 4px;font-size:10px;font-weight:600;text-align:left;border:1px solid #0a1525;}
        .qa4-table th:nth-child(1),.qa4-table th:nth-child(5){text-align:center;}
        .qa4-table th:nth-child(4),.qa4-table th:nth-child(6),.qa4-table th:nth-child(7){text-align:right;}
        .qa4-table td{padding:5px 4px;border:1px solid #d0d6dd;font-size:10px;vertical-align:top;}
        .qa4-table td.c{text-align:center;}
        .qa4-table td.r{text-align:right;font-variant-numeric:tabular-nums;}
        .qa4-table td.spec{font-size:9px;color:#666;}
        .sec-row td{background:#eef2f7;font-weight:700;color:#0a1525;font-size:10px;padding:5px 6px;}
        .tot-row td{background:#f8f9fb;font-weight:600;}
        .tot-row.grand td{background:#0a1525;color:#fff;font-size:13px;padding:8px 6px;}
        .qa4-summary{margin:10px 0;display:flex;justify-content:flex-end;}
        .qa4-key{background:#0a1525;color:#fff;padding:10px 18px;text-align:right;}
        .qa4-key-label{font-size:10px;opacity:.7;letter-spacing:1px;}
        .qa4-key-val{font-size:20px;font-weight:800;margin:2px 0;}
        .qa4-key-unit{font-size:9px;opacity:.7;}
        .qa4-notes{margin-top:14px;border-top:1px solid #ddd;padding-top:8px;}
        .qa4-notes-title{font-size:11px;font-weight:700;margin-bottom:4px;}
        .qa4-notes ul{margin:0;padding-left:14px;font-size:9.5px;color:#444;line-height:1.5;}
        .qa4-sigs{display:flex;gap:30px;margin-top:24px;}
        .qa4-sig{flex:1;}
        .qa4-sig-label{font-size:10px;color:#666;margin-bottom:18px;}
        .qa4-sig-line{border-top:1px solid #0a1525;}
        .qa4-footer{margin-top:14px;border-top:1px solid #eee;padding-top:6px;font-size:9px;color:#888;}
        .qa4-foot-note{text-align:center;margin-bottom:4px;}
        .qa4-foot-row{display:flex;justify-content:space-between;align-items:center;gap:10px;}
        .qa4-foot-l{flex:1 1 auto;min-width:0;font-size:8.5px;color:#7a8694;}
        .qa4-foot-r{flex:0 0 auto;font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;font-weight:600;font-size:9.5px;color:#3d4f63;}
      </style>
    `;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${STATE.client.quote_no} Quotation</title>${styles}</head><body>${a4.outerHTML}<script>window.onload=()=>{setTimeout(()=>{window.print();},300);};<\/script></body></html>`);
    w.document.close();
    // Restore the on-page A4 preview to the full breakdown after a client-mode capture
    if(mode === 'client'){ setTimeout(() => renderPreview('full'), 100); }
  }

  // === METHOD STATEMENT GENERATION ===
  // Multi-page A4 method statement with project info, scope, materials,
  // 8-step procedure, QA/QC, HSE, shop drawings, and sign-off.
  // Reuses existing buildFloorPlan / buildCrossSection helpers.
  const STEP_DATA = [
    { num:'01',
      title:{ja:'削孔箇所の位置決め・隅出し',en:'Drill Position Marking',zh:'鑽孔位置放樣'},
      purpose:{ja:'適切な間隔と均一な被覆範囲を確保するため、注入孔位置を事前に正確にマーキングする。',en:'Pre-mark all injection-hole positions to ensure even pitch and full coverage of the application area.',zh:'預先精準標示所有注入孔位，以確保均勻孔距與完整覆蓋範圍。'},
      duration:{ja:'2〜3 時間 / 100 m²',en:'2–3 hr / 100 m²',zh:'2–3 小時 / 100 m²'},
      tools:{ja:'チョーク、墨壺、メジャー、レーザー墨出器',en:'Chalk, ink line, tape measure, laser line',zh:'粉筆、墨斗、捲尺、雷射水平儀'},
      checkpoint:{ja:'標準ピッチ 500 mm の正方格子配置／躯体寸法に応じて 400〜600 mm で調整可',en:'Standard pitch 500 mm in a square grid; adjustable 400–600 mm per geometry.',zh:'標準孔距 500 mm 正方格網；依現場幾何可在 400–600 mm 範圍內調整。'},
    },
    { num:'02',
      title:{ja:'振動ドリルによる穿孔',en:'Vibration Drill Boring',zh:'振動電鑽鑽孔'},
      purpose:{ja:'保護モルタル・押え層を貫通し、既設防水層直下まで注入経路を確保する。',en:'Drill through the protective mortar / topping to create a clear injection path immediately below the existing waterproof layer.',zh:'貫穿保護砂漿與面層，建立通往既有防水層下方之注入路徑。'},
      duration:{ja:'4〜6 時間 / 100 m²',en:'4–6 hr / 100 m²',zh:'4–6 小時 / 100 m²'},
      tools:{ja:'振動ドリル、φ 10〜12 mm × L80 ビット、集塵機',en:'Hammer drill, φ 10–12 mm × L80 bit, dust extractor',zh:'振動電鑽、φ 10–12 mm × L80 鑽頭、集塵機'},
      checkpoint:{ja:'スラブに到達直前で停止／RC 躯体を傷つけないこと',en:'Stop immediately upon reaching the RC slab; do not damage the structural concrete.',zh:'觸及 RC 樓板即停止，避免損傷主體結構。'},
    },
    { num:'03',
      title:{ja:'切粉清掃・内部残留水の吸引排出',en:'Chip Cleaning & Residual Water Extraction',zh:'清除鑽屑・抽除殘留積水'},
      purpose:{ja:'孔内のダストと滞留水を除去し、ナルライト樹脂と既設防水層の密着性能を確保する。',en:'Remove drilling dust and trapped water from each hole to ensure proper bond between Narulight resin and the existing waterproofing.',zh:'清除孔內粉塵與積水，確保 Narulight 樹脂與原防水層之黏結性能。'},
      duration:{ja:'2 時間 / 100 m²',en:'2 hr / 100 m²',zh:'2 小時 / 100 m²'},
      tools:{ja:'乾湿掃除機、スポイト、エアブロー',en:'Wet/dry vacuum, pipette, air blower',zh:'乾濕兩用吸塵機、滴管、吹氣球'},
      checkpoint:{ja:'各孔をブロー後に目視確認、含水率を要確認',en:'Visually inspect each hole after blow-out; verify residual moisture content.',zh:'各孔吹清後目視檢查，確認含水率。'},
    },
    { num:'04',
      title:{ja:'硬化促進剤（アロフィクス MC）の混合',en:'Hardening Accelerator (Alofix MC) Mixing',zh:'混合硬化促進劑（Alofix MC）'},
      purpose:{ja:'施工条件に応じた硬化時間を確保し、注入後の漏水再発を防ぐ。',en:'Achieve job-specific cure time and prevent re-leakage after injection.',zh:'依工地條件設定凝結時間，避免注入後再次漏水。'},
      duration:{ja:'30 分（バッチ毎）',en:'30 min (per batch)',zh:'30 分鐘（每批）'},
      tools:{ja:'計量秤、清水、電動撹拌機、計量バケツ',en:'Scale, clean water, electric mixer, mixing bucket',zh:'磅秤、清水、電動攪拌機、攪拌桶'},
      checkpoint:{ja:'重量比 15 % 混入／清水で先に溶解、2 分間電動撹拌',en:'Add 15 % MC by weight; pre-dissolve in water then mix into resin for 2 min.',zh:'依重量比 15 % 添加；先以清水溶解後再加入樹脂攪拌 2 分鐘。'},
    },
    { num:'05',
      title:{ja:'注入ノズルのセット',en:'Injection Nozzle Installation',zh:'安裝注入針頭'},
      purpose:{ja:'圧入時のシールを確保し、注入材の逆流・漏れを防止する。',en:'Provide a tight pressure seal and prevent backflow during injection.',zh:'提供壓力密封並防止注入時逆流。'},
      duration:{ja:'1〜2 時間 / 100 m²',en:'1–2 hr / 100 m²',zh:'1–2 小時 / 100 m²'},
      tools:{ja:'注入ノズル、ハンマー、ノズルレンチ',en:'Injection nozzle, hammer, nozzle wrench',zh:'注入針頭、鐵鎚、針頭板手'},
      checkpoint:{ja:'最初の注入は最低位（水下側）から開始すること',en:'Always begin injection from the lowest (water-side) point.',zh:'注入須由最低點（水側）開始。'},
    },
    { num:'06',
      title:{ja:'ナルライトの圧入',en:'Narulight Pressure Injection',zh:'加壓注入 Narulight'},
      purpose:{ja:'既設防水層下の漏水経路を樹脂で連続的に充填し、層全体を再生する。',en:'Fill all leak paths beneath the existing waterproof layer with a continuous mass of resin to regenerate the entire layer.',zh:'以樹脂連續填充既有防水層下之漏水路徑，使整層再生。'},
      duration:{ja:'6〜8 時間 / 100 m²（注入機 1 台）',en:'6–8 hr / 100 m² (per injection unit)',zh:'6–8 小時 / 100 m²（每台注入機）'},
      tools:{ja:'高圧注入ポンプ（≥ 3 MPa）、圧力計、ホース',en:'High-pressure injection pump (≥ 3 MPa), pressure gauge, hose',zh:'高壓注入幫浦（≥ 3 MPa）、壓力錶、注入管'},
      checkpoint:{ja:'隣接孔から原液が流出するまで継続注入。圧力範囲 1.0〜3.0 MPa を記録',en:'Continue injection until undiluted resin flows from adjacent holes. Record working pressure 1.0–3.0 MPa.',zh:'持續注入至相鄰孔湧出原液為止；記錄工作壓力 1.0–3.0 MPa。'},
    },
    { num:'07',
      title:{ja:'コルク栓仮止め・隣接穴へ移動',en:'Cork Plugging & Sequential Movement',zh:'軟木塞暫封・移至相鄰孔'},
      purpose:{ja:'注入完了孔を仮閉鎖し、面全体に連続的に圧力を伝達する。',en:'Temporarily seal completed holes and transfer pressure progressively across the full plane.',zh:'暫封已完成之孔，並在整個施工面連續傳遞壓力。'},
      duration:{ja:'施工と並行',en:'Concurrent with injection',zh:'與注入並行進行'},
      tools:{ja:'コルク栓、ハンマー',en:'Cork plug, hammer',zh:'軟木塞、鐵鎚'},
      checkpoint:{ja:'仮止め後、隣接孔から続けて注入。連続マス（一塊）として広げる',en:'After plugging, continue injection from adjacent holes — propagate as a single continuous mass.',zh:'封孔後由相鄰孔接續注入，使資材以連續團塊擴展。'},
    },
    { num:'08',
      title:{ja:'穴詰め・清掃・完了確認',en:'Hole Sealing, Cleanup & Verification',zh:'砂漿封孔・清掃・完工確認'},
      purpose:{ja:'すべての注入孔を仕上げ層と同一面に整え、漏水停止を最終確認する。',en:'Finish all injection holes flush with the surface and verify cessation of leakage.',zh:'所有注入孔與面層收平整，並確認漏水已停止。'},
      duration:{ja:'2〜3 時間 / 100 m²',en:'2–3 hr / 100 m²',zh:'2–3 小時 / 100 m²'},
      tools:{ja:'急結防水モルタル、コテ、ウェス、漏水点検記録表',en:'Rapid-set waterproof mortar, trowel, rags, leak inspection log',zh:'速凝防水砂漿、抹刀、抹布、漏水檢查紀錄表'},
      checkpoint:{ja:'階下天井面の漏水停止を 24 時間後に再確認、写真記録',en:'Re-inspect ceiling below for leak cessation 24 hr later; photographic record.',zh:'24 小時後再檢查下方天花板漏水停止情形，並留存照片紀錄。'},
    },
  ];

  // === STEP SHOP DRAWINGS ===
  // Detailed shop drawing per step. 480×280 viewBox, lots of breathing room.
  // Adapts to Model A (no insulation) vs Model B (with insulation).
  function stepDrawing(num){
    const isB = STATE.project.structure === 'protect_with_insulation';
    const rawLang = getLang();
    const lang = (rawLang === 'jp') ? 'ja' : rawLang;
    // Localized layer labels
    const L = {
      ja: { tile:'仕上げ層', cinder:'保護モルタル', ins:'断熱材', wp:'既設防水層', slab:'RC スラブ' },
      en: { tile:'Topping / tile', cinder:'Cinder concrete', ins:'Insulation', wp:'Existing WP', slab:'RC slab' },
      zh: { tile:'面層 / 磁磚', cinder:'保護砂漿', ins:'隔熱層', wp:'既有防水層', slab:'RC 樓板' },
    }[lang];

    // Common roof-stack drawn once. Top of stack y=70, bottom y=240.
    // Layer rows (from top to bottom): tile / cinder / [ins] / wp / slab
    const stack = isB ? `
      <rect x="40" y="70"  width="400" height="22" fill="#e5d3a8" stroke="#8a6c34" stroke-width="0.8"/>
      <rect x="40" y="92"  width="400" height="34" fill="#c4ccd6" stroke="#5b6b80" stroke-width="0.8"/>
      <rect x="40" y="126" width="400" height="22" fill="#b89bd9" stroke="#5e3a8a" stroke-width="0.8"/>
      <pattern id="ins-h-${num}" patternUnits="userSpaceOnUse" width="6" height="6"><path d="M 0,6 L 6,0" stroke="#5e3a8a" stroke-width="0.5"/></pattern>
      <rect x="40" y="126" width="400" height="22" fill="url(#ins-h-${num})" opacity="0.6"/>
      <rect x="40" y="148" width="400" height="6"  fill="#0d1b2a" stroke="#0d1b2a" stroke-width="0.4"/>
      <rect x="40" y="154" width="400" height="86" fill="#dde3eb" stroke="#5b6b80" stroke-width="0.8"/>
      <!-- aggregate dots in slab -->
      <g fill="#5b6b80" opacity="0.4">${[60,110,160,210,260,310,360,410].map(x=>`<circle cx="${x}" cy="${180+(x%30)/2}" r="1.5"/>`).join('')}${[80,140,200,270,340,400].map(x=>`<circle cx="${x}" cy="${210+(x%20)/2}" r="1.8"/>`).join('')}</g>
      <text x="450" y="86"  font-size="11" fill="#7a5a25" text-anchor="start" font-family="sans-serif" font-weight="600">${L.tile}</text>
      <text x="450" y="113" font-size="11" fill="#5b6b80" text-anchor="start" font-family="sans-serif" font-weight="600">${L.cinder}</text>
      <text x="450" y="142" font-size="11" fill="#5e3a8a" text-anchor="start" font-family="sans-serif" font-weight="600">${L.ins}</text>
      <text x="450" y="155" font-size="11" fill="#0d1b2a" text-anchor="start" font-family="sans-serif" font-weight="600">${L.wp}</text>
      <text x="450" y="200" font-size="11" fill="#3d4f63" text-anchor="start" font-family="sans-serif" font-weight="600">${L.slab}</text>
      <!-- thickness ticks -->
      <g stroke="#3d4f63" stroke-width="0.5" font-size="9" fill="#3d4f63" font-family="sans-serif">
        <line x1="32" y1="70"  x2="32" y2="148"/><line x1="28" y1="70"  x2="36" y2="70"/><line x1="28" y1="148" x2="36" y2="148"/>
        <text x="14" y="112" text-anchor="middle">~80mm</text>
      </g>
    ` : `
      <rect x="40" y="70"  width="400" height="30" fill="#e5d3a8" stroke="#8a6c34" stroke-width="0.8"/>
      <rect x="40" y="100" width="400" height="50" fill="#c4ccd6" stroke="#5b6b80" stroke-width="0.8"/>
      <rect x="40" y="150" width="400" height="8"  fill="#0d1b2a" stroke="#0d1b2a" stroke-width="0.4"/>
      <rect x="40" y="158" width="400" height="82" fill="#dde3eb" stroke="#5b6b80" stroke-width="0.8"/>
      <g fill="#5b6b80" opacity="0.4">${[60,110,160,210,260,310,360,410].map(x=>`<circle cx="${x}" cy="${180+(x%30)/2}" r="1.5"/>`).join('')}${[80,140,200,270,340,400].map(x=>`<circle cx="${x}" cy="${210+(x%20)/2}" r="1.8"/>`).join('')}</g>
      <text x="450" y="90"  font-size="11" fill="#7a5a25" text-anchor="start" font-family="sans-serif" font-weight="600">${L.tile}</text>
      <text x="450" y="128" font-size="11" fill="#5b6b80" text-anchor="start" font-family="sans-serif" font-weight="600">${L.cinder}</text>
      <text x="450" y="158" font-size="11" fill="#0d1b2a" text-anchor="start" font-family="sans-serif" font-weight="600">${L.wp}</text>
      <text x="450" y="200" font-size="11" fill="#3d4f63" text-anchor="start" font-family="sans-serif" font-weight="600">${L.slab}</text>
      <g stroke="#3d4f63" stroke-width="0.5" font-size="9" fill="#3d4f63" font-family="sans-serif">
        <line x1="32" y1="70"  x2="32" y2="150"/><line x1="28" y1="70"  x2="36" y2="70"/><line x1="28" y1="150" x2="36" y2="150"/>
        <text x="14" y="115" text-anchor="middle">~70mm</text>
      </g>
    `;
    // Y-coordinate where the WP layer sits (top edge)
    const wpY = isB ? 148 : 150;
    // Y-coordinate where drilled hole bottom should be (just above WP)
    const drillBottom = wpY;
    // Top surface y
    const topY = 70;

    const overlays = {
      '01': `
        <!-- Tape measure across surface -->
        <rect x="40" y="${topY-22}" width="400" height="6" fill="#fff" stroke="#0d1b2a" stroke-width="0.5"/>
        ${[0,1,2,3,4,5,6,7,8].map(i=>`<line x1="${40+i*50}" y1="${topY-22}" x2="${40+i*50}" y2="${topY-16}" stroke="#0d1b2a" stroke-width="0.5"/><text x="${40+i*50}" y="${topY-26}" font-size="8" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif">${i*500}</text>`).join('')}
        <!-- Mark crosses at 500 mm pitch on top surface -->
        ${[90,140,190,240,290,340,390].map(x=>`<g><line x1="${x-5}" y1="${topY+4}" x2="${x+5}" y2="${topY+12}" stroke="#c1272d" stroke-width="2"/><line x1="${x-5}" y1="${topY+12}" x2="${x+5}" y2="${topY+4}" stroke="#c1272d" stroke-width="2"/></g>`).join('')}
        <!-- Pitch annotation -->
        <g stroke="#0d1b2a" stroke-width="0.6" fill="#0d1b2a" font-family="sans-serif">
          <line x1="140" y1="48" x2="190" y2="48"/>
          <line x1="140" y1="44" x2="140" y2="52"/>
          <line x1="190" y1="44" x2="190" y2="52"/>
          <text x="165" y="42" font-size="10" text-anchor="middle">500 mm</text>
        </g>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 01 · Mark drill positions in 500 mm grid</text>
      `,
      '02': `
        <!-- Drill body + handle -->
        <rect x="200" y="0"  width="80" height="36" rx="4" fill="#0066cc" stroke="#0d1b2a" stroke-width="0.8"/>
        <rect x="200" y="36" width="80" height="6"  fill="#003d80"/>
        <rect x="232" y="-12" width="16" height="14" fill="#0d1b2a"/>
        <rect x="234" y="-22" width="12" height="10" fill="#0d1b2a"/>
        <!-- Chuck -->
        <rect x="232" y="42" width="16" height="14" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.4"/>
        <!-- Drill bit going down through tile + cinder, stopping at top of WP -->
        <rect x="237" y="56" width="6" height="${drillBottom-56}" fill="#aab4c0" stroke="#0d1b2a" stroke-width="0.5"/>
        <!-- Drilled hole (white) through layers -->
        <rect x="237" y="${topY}" width="6" height="${drillBottom-topY}" fill="#fff" stroke="#0d1b2a" stroke-width="0.6" stroke-dasharray="3,2"/>
        <!-- Stop indicator at WP (line only, label moved out of layer area) -->
        <line x1="220" y1="${drillBottom}" x2="260" y2="${drillBottom}" stroke="#c1272d" stroke-width="2"/>
        <!-- Bit dimension callout in top airspace -->
        <g stroke="#0d1b2a" stroke-width="0.5" fill="#0d1b2a" font-family="sans-serif" font-size="9">
          <line x1="330" y1="24" x2="360" y2="24"/>
          <line x1="330" y1="21" x2="330" y2="27"/>
          <line x1="360" y1="21" x2="360" y2="27"/>
          <text x="395" y="27" font-weight="700">φ 10–12 mm</text>
        </g>
        <!-- STOP-at-WP callout in top airspace -->
        <g font-family="sans-serif">
          <rect x="330" y="38" width="110" height="18" fill="#c1272d" rx="2"/>
          <text x="385" y="50" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">STOP at WP layer</text>
        </g>
        <!-- Dust extractor -->
        <path d="M 100,30 L 100,55 L 220,55" stroke="#5b6b80" stroke-width="2" fill="none"/>
        <text x="100" y="22" font-size="9" fill="#5b6b80" text-anchor="middle" font-family="sans-serif">Dust extr.</text>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 02 · Drill through topping &amp; cinder, stop above WP</text>
      `,
      '03': `
        <!-- Vacuum tube -->
        <rect x="232" y="-2" width="16" height="14" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.4"/>
        <rect x="234" y="12" width="12" height="10" fill="#3d4f63"/>
        <line x1="240" y1="22" x2="240" y2="${topY-2}" stroke="#0d1b2a" stroke-width="2.4"/>
        <!-- Hose curve -->
        <path d="M 240,22 Q 130,22 100,${topY-2} L 60,${topY-2}" stroke="#3d4f63" stroke-width="2.5" fill="none"/>
        <!-- Hole emptied (light blue) -->
        <rect x="237" y="${topY}" width="6" height="${drillBottom-topY}" fill="#eaf2ff" stroke="#0d1b2a" stroke-width="0.5"/>
        <!-- Suction arrows around the hole top -->
        <g stroke="#0066cc" stroke-width="1.2" fill="none">
          <path d="M 215,${topY+8} Q 230,${topY+2} 235,${topY+8}"/>
          <polygon points="235,${topY+8} 232,${topY+5} 232,${topY+11}" fill="#0066cc"/>
          <path d="M 265,${topY+8} Q 250,${topY+2} 245,${topY+8}"/>
          <polygon points="245,${topY+8} 248,${topY+5} 248,${topY+11}" fill="#0066cc"/>
        </g>
        <!-- Water droplets being removed -->
        <g fill="#0066cc">
          <circle cx="120" cy="${topY-30}" r="2"/>
          <circle cx="135" cy="${topY-26}" r="2.5"/>
          <circle cx="150" cy="${topY-32}" r="1.8"/>
        </g>
        <text x="105" y="${topY-44}" font-size="10" fill="#0066cc" text-anchor="middle" font-family="sans-serif" font-weight="600">→ vacuum</text>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 03 · Vacuum dust &amp; extract residual water from each hole</text>
      `,
      '04': `
        <!-- All equipment kept above the roof stack (y < 65) -->
        <!-- Mixing bucket (left) -->
        <path d="M 50,5 L 50,52 Q 50,58 56,58 L 124,58 Q 130,58 130,52 L 130,5 Z" fill="#fff" stroke="#0d1b2a" stroke-width="0.8"/>
        <ellipse cx="90" cy="5" rx="40" ry="4" fill="#fff" stroke="#0d1b2a" stroke-width="0.6"/>
        <ellipse cx="90" cy="30" rx="38" ry="3.5" fill="#0066cc" opacity="0.65"/>
        <line x1="90" y1="-12" x2="90" y2="48" stroke="#5b6b80" stroke-width="2"/>
        <rect x="86" y="-12" width="8" height="8" fill="#5b6b80"/>
        <line x1="78" y1="46" x2="102" y2="46" stroke="#5b6b80" stroke-width="1.6"/>
        <text x="90" y="71" font-size="9" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Mixer · 2 min</text>
        <!-- Resin drum (center) -->
        <rect x="170" y="10" width="62" height="50" fill="#c1272d" stroke="#0d1b2a" stroke-width="0.6"/>
        <rect x="170" y="10" width="62" height="9" fill="#a01f25"/>
        <text x="201" y="38" font-size="10.5" fill="#fff" text-anchor="middle" font-weight="700" font-family="sans-serif">NARULIGHT</text>
        <text x="201" y="51" font-size="8" fill="#fff" text-anchor="middle" font-family="sans-serif">16 kg / can</text>
        <!-- MC bottle (right of drum) -->
        <rect x="248" y="22" width="32" height="38" fill="#f9b234" stroke="#0d1b2a" stroke-width="0.5"/>
        <rect x="254" y="14" width="20" height="8" fill="#d8941d" stroke="#0d1b2a" stroke-width="0.4"/>
        <text x="264" y="42" font-size="9" fill="#0d1b2a" text-anchor="middle" font-weight="700" font-family="sans-serif">Alofix</text>
        <text x="264" y="54" font-size="9" fill="#0d1b2a" text-anchor="middle" font-weight="700" font-family="sans-serif">MC</text>
        <!-- Ratio formula (top-right, well above stack) -->
        <g font-family="sans-serif">
          <rect x="298" y="18" width="138" height="34" fill="#fff" stroke="#0d1b2a" stroke-width="0.6" rx="2"/>
          <text x="367" y="33" font-size="10" fill="#5b6b80" text-anchor="middle" font-weight="600">MIX RATIO</text>
          <text x="367" y="48" font-size="11" fill="#0d1b2a" text-anchor="middle" font-weight="700">Naru + 15 % MC</text>
        </g>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 04 · Mix Narulight + 15 % Alofix MC by weight</text>
      `,
      '05': `
        <!-- Nozzle body sitting on top surface -->
        <rect x="220" y="40" width="40" height="20" rx="3" fill="#0066cc" stroke="#0d1b2a" stroke-width="0.6"/>
        <rect x="232" y="60" width="16" height="10" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.5"/>
        <!-- Nozzle shaft into hole -->
        <rect x="237" y="${topY}" width="6" height="${drillBottom-topY}" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.5"/>
        <!-- Sealing rubber rings on nozzle (label moved to top airspace) -->
        <rect x="234" y="${topY+8}"  width="12" height="3" fill="#0d1b2a"/>
        <rect x="234" y="${topY+18}" width="12" height="3" fill="#0d1b2a"/>
        <g font-family="sans-serif">
          <rect x="325" y="4" width="110" height="16" fill="#fff" stroke="#0d1b2a" stroke-width="0.5" rx="2"/>
          <text x="380" y="15" font-size="9" fill="#0d1b2a" text-anchor="middle" font-weight="700">Rubber seal × 2 (pressure-tight)</text>
        </g>
        <line x1="325" y1="14" x2="248" y2="${topY+12}" stroke="#0d1b2a" stroke-width="0.5" stroke-dasharray="3,2"/>
        <!-- Hose to pump -->
        <path d="M 240,40 Q 100,30 60,55" stroke="#0d1b2a" stroke-width="2.5" fill="none"/>
        <text x="80" y="22" font-size="10" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif">→ from pump</text>
        <!-- Indicate water-side / lowest point (badge in top airspace) -->
        <g font-family="sans-serif">
          <rect x="108" y="38" width="105" height="18" fill="#0066cc" rx="2"/>
          <text x="160" y="50" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">↓ Start at lowest pt</text>
        </g>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 05 · Set pressure-tight nozzle, begin from lowest point</text>
      `,
      '06': `
        <!-- Active resin spreading horizontally beneath WP at slab interface -->
        <rect x="40" y="${wpY-1}" width="400" height="${isB?8:10}" fill="#0066cc" opacity="0.65"/>
        <!-- Spread arrows along WP -->
        <g stroke="#0066cc" stroke-width="2" fill="none">
          ${[80,140,200,300,360,420].map(x=>`<path d="M ${x-15},${wpY+(isB?3:5)} L ${x+15},${wpY+(isB?3:5)}"/><polygon points="${x+15},${wpY+(isB?3:5)} ${x+10},${wpY-1} ${x+10},${wpY+(isB?7:11)}" fill="#0066cc"/>`).join('')}
        </g>
        <!-- Active nozzle -->
        <rect x="220" y="40" width="40" height="20" rx="3" fill="#c1272d" stroke="#0d1b2a" stroke-width="0.6"/>
        <text x="240" y="54" font-size="9" fill="#fff" text-anchor="middle" font-weight="700" font-family="sans-serif">PUMP</text>
        <rect x="237" y="60" width="6" height="${wpY-60}" fill="#5b6b80"/>
        <!-- Pressure gauge -->
        <circle cx="380" cy="40" r="22" fill="#fff" stroke="#0d1b2a" stroke-width="1"/>
        <line x1="380" y1="40" x2="395" y2="28" stroke="#c1272d" stroke-width="2"/>
        <text x="380" y="68" font-size="9" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">1.0–3.0 MPa</text>
        <text x="380" y="44" font-size="8" fill="#3d4f63" text-anchor="middle" font-family="sans-serif">MPa</text>
        <!-- Resin emerging from adjacent holes (success indicator) -->
        <g fill="#0066cc">
          <path d="M 80,${topY+4} Q 78,${topY-2} 80,${topY-8} Q 82,${topY-2} 80,${topY+4} Z"/>
          <path d="M 420,${topY+4} Q 418,${topY-2} 420,${topY-8} Q 422,${topY-2} 420,${topY+4} Z"/>
        </g>
        <text x="80" y="${topY-18}" font-size="9" fill="#0066cc" text-anchor="middle" font-weight="600" font-family="sans-serif">resin out</text>
        <text x="420" y="${topY-18}" font-size="9" fill="#0066cc" text-anchor="middle" font-weight="600" font-family="sans-serif">resin out</text>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 06 · Inject 1.0–3.0 MPa until resin flows from adjacent holes</text>
      `,
      '07': `
        <!-- Filled mass beneath WP -->
        <rect x="40" y="${wpY-1}" width="400" height="${isB?8:10}" fill="#0066cc" opacity="0.85"/>
        <!-- Three holes: left = corked, middle = active nozzle, right = next target -->
        <!-- LEFT: cork plug -->
        <rect x="118" y="${topY}" width="6" height="${drillBottom-topY}" fill="#a06a3a" stroke="#0d1b2a" stroke-width="0.4"/>
        <ellipse cx="121" cy="${topY-2}" rx="6" ry="3" fill="#a06a3a" stroke="#0d1b2a" stroke-width="0.4"/>
        <text x="121" y="${topY-12}" font-size="10" fill="#a06a3a" text-anchor="middle" font-weight="700" font-family="sans-serif">CORK</text>
        <!-- MIDDLE: active nozzle (just finished) -->
        <rect x="220" y="40" width="40" height="20" rx="3" fill="#c1272d" stroke="#0d1b2a" stroke-width="0.6"/>
        <rect x="237" y="60" width="6" height="${wpY-60}" fill="#5b6b80"/>
        <text x="240" y="54" font-size="9" fill="#fff" text-anchor="middle" font-weight="700" font-family="sans-serif">DONE</text>
        <!-- RIGHT: open hole, next target -->
        <rect x="357" y="${topY}" width="6" height="${drillBottom-topY}" fill="#fff" stroke="#0d1b2a" stroke-width="0.5" stroke-dasharray="2,1.5"/>
        <text x="360" y="${topY-12}" font-size="10" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">NEXT</text>
        <!-- Movement arrow -->
        <g stroke="#c1272d" stroke-width="2" fill="none">
          <path d="M 270,30 L 350,30" stroke-dasharray="6,3"/>
          <polygon points="350,30 344,26 344,34" fill="#c1272d"/>
        </g>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 07 · Cork-plug completed hole, advance to adjacent hole</text>
      `,
      '08': `
        <!-- Continuous filled mass beneath WP, full extent -->
        <rect x="40" y="${wpY-1}" width="400" height="${isB?8:10}" fill="#0066cc" opacity="0.95"/>
        <!-- All injection holes capped with mortar (top-flush) -->
        ${[90,160,230,310,390].map(x=>`<rect x="${x-3}" y="${topY}" width="6" height="${drillBottom-topY}" fill="#aab4c0" stroke="#0d1b2a" stroke-width="0.4"/><rect x="${x-5}" y="${topY-3}" width="10" height="3" fill="#aab4c0" stroke="#0d1b2a" stroke-width="0.4"/>`).join('')}
        <!-- Trowel finishing surface -->
        <g transform="translate(170,${topY-32})">
          <rect x="0" y="0" width="80" height="6" fill="#aab4c0" stroke="#0d1b2a" stroke-width="0.5"/>
          <rect x="36" y="-12" width="8" height="12" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.4"/>
          <rect x="34" y="-20" width="12" height="8" fill="#5b6b80" stroke="#0d1b2a" stroke-width="0.4"/>
        </g>
        <!-- Big check mark -->
        <g stroke="#1a7a3a" stroke-width="4" fill="none">
          <path d="M 380,32 L 395,48 L 420,18"/>
        </g>
        <text x="400" y="62" font-size="11" fill="#1a7a3a" text-anchor="middle" font-weight="700" font-family="sans-serif">VERIFIED</text>
        <text x="240" y="270" font-size="12" fill="#0d1b2a" text-anchor="middle" font-family="sans-serif" font-weight="600">Step 08 · Mortar-seal all holes flush, verify leak cessation 24 h later</text>
      `,
    };

    return `<svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${stack}${overlays[num] || ''}</svg>`;
  }

  function generateMethodStatement(){
    const rawLang = getLang();
    // Method Statement was authored assuming 'ja' as the JP key; getLang returns 'jp' for back-compat.
    const lang = (rawLang === 'jp') ? 'ja' : rawLang;
    const t = T[lang];
    const p = STATE.project;
    const cl = STATE.client;
    const struct = STRUCTURES[p.structure];
    const r = compute();
    const fmt = (n) => Number(n).toLocaleString('en-US', {maximumFractionDigits:1});
    const today = new Date();
    // Prefer the user-entered quote date, fall back to today
    const dateStr = (cl && cl.date) ? cl.date : today.toISOString().slice(0,10);
    const docNo = 'MS-' + dateStr.replace(/-/g,'') + '-' + (cl.quote_no ? String(cl.quote_no).split('-').pop() : 'XX');
    const distLine = lang==='ja' ? '成瀬化学株式会社 台湾認定販売店' : lang==='zh' ? '成瀬化學株式會社 台灣認定販売店' : 'Authorized Distributor in Taiwan for Narusekagaku Co., Ltd.';
    const co = STATE.company || {};
    // Build localized technical-consultation line. Uses whatever the user has filled in
    // on the Company panel; falls back to a label-only string so the footer is never empty.
    const techLabel = lang==='ja' ? '技術相談' : lang==='zh' ? '技術諮詢' : 'Technical consultation';
    const consultBits = [];
    if (co.phone) consultBits.push(co.phone);
    if (co.email) consultBits.push(co.email);
    const techLine = consultBits.length
      ? `${techLabel}：${consultBits.join(' · ')}`
      : `${techLabel}：${co.name || '好時新創有限公司 Good Startup Co., Ltd.'}`;
    const pageFoot = `<div class="ms-page-foot"><div class="ms-foot-l"><div>© ${today.getFullYear()} 好時新創有限公司 Good Startup Co., Ltd. · ${distLine} · ${docNo}</div><div class="ms-foot-l-2">${techLine}</div></div><div class="ms-foot-r">__PG__ / __TOTAL__</div></div>`;
    const structLabel = struct ? (struct[lang] || struct.en) : '';

    // Localized step labels
    const stepRows = STEP_DATA.map(s => `
      <tr>
        <td class="ms-step-num">${s.num}</td>
        <td class="ms-step-body">
          <div class="ms-step-title">${s.title[lang]}</div>
          <div class="ms-step-grid">
            <div class="ms-step-text">
              <div class="ms-step-row"><span class="ms-step-lbl">${t.ms_step_purpose}</span><span>${s.purpose[lang]}</span></div>
              <div class="ms-step-row"><span class="ms-step-lbl">${t.ms_step_dur}</span><span>${s.duration[lang]}</span></div>
              <div class="ms-step-row"><span class="ms-step-lbl">${t.ms_step_tools}</span><span>${s.tools[lang]}</span></div>
              <div class="ms-step-row"><span class="ms-step-lbl">${t.ms_step_check}</span><span>${s.checkpoint[lang]}</span></div>
            </div>
            <div class="ms-step-draw">${stepDrawing(s.num)}</div>
          </div>
        </td>
      </tr>
    `).join('');

    const li = (arr) => arr.map(x => `<li>${x}</li>`).join('');

    // Compose the multi-page A4 document
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${t.ms_title} — ${cl.project || ''}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 12mm 18mm;
    @bottom-left {
      content: string(footL);
      font-family: ${lang === 'ja' ? "'Noto Sans JP','Yu Gothic',sans-serif" : lang === 'zh' ? "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif" : "'Inter',-apple-system,sans-serif"};
      font-size: 7pt;
      color: #7a8694;
      vertical-align: top;
      padding-top: 2mm;
      border-top: 0.4pt solid #d4dae1;
      white-space: pre-line;
      line-height: 1.4;
    }
    @bottom-right {
      content: counter(page, decimal-leading-zero) " / " counter(pages, decimal-leading-zero);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 8pt;
      font-weight: 600;
      color: #3d4f63;
      letter-spacing: 1px;
      vertical-align: top;
      padding-top: 2mm;
      border-top: 0.4pt solid #d4dae1;
    }
  }
  body { string-set: footL "\u00a9 ${today.getFullYear()} \u597d\u6642\u65b0\u5275\u6709\u9650\u516c\u53f8 Good Startup Co., Ltd. \u00b7 ${distLine} \u00b7 ${docNo}\A ${techLine.replace(/"/g,'\\"')}"; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  body {
    font-family: ${lang === 'ja' ? "'Noto Sans JP','Yu Gothic',sans-serif" : lang === 'zh' ? "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif" : "'Inter',-apple-system,sans-serif"};
    font-size: 9.5pt; line-height: 1.55; color: #0d1b2a;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { page-break-after: always; padding: 0; }
  .page:last-child { page-break-after: auto; }
  .page-body { }
  /* In-flow footer fallback for browsers that do not honor @bottom-left margin boxes (Chrome &lt; 131 etc.) */
  .ms-page-foot { display: none; }
  @media screen {
    .ms-page-foot { display: flex; margin-top: 8mm; padding-top: 2mm; border-top: 0.4pt solid #d4dae1; justify-content: space-between; align-items: center; gap: 8mm; font-size: 7pt; color: #7a8694; }
    .ms-page-foot .ms-foot-l { flex: 1 1 auto; min-width: 0; }
    .ms-page-foot .ms-foot-r { flex: 0 0 auto; font-weight: 600; color: #3d4f63; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1px; font-size: 8pt; }
  }
  .ms-cover { display: flex; flex-direction: column; min-height: 245mm; }
  .ms-cover-top { border-bottom: 3px solid #0d1b2a; padding-bottom: 12mm; }
  .ms-brand { font-family:'Barlow Condensed',sans-serif; font-size:10pt; letter-spacing:3px; text-transform:uppercase; color:#5b6b80; }
  .ms-cover h1 { font-size: 26pt; line-height:1.15; margin: 14mm 0 5mm; font-weight: 800; letter-spacing:-0.5px; }
  .ms-cover h2 { font-size: 14pt; font-weight: 500; color:#3d4f63; margin:0 0 16mm; }
  .ms-cover-table { width:100%; border-collapse:collapse; margin-top: 8mm; }
  .ms-cover-table td { padding: 4.5mm 5mm; border-bottom: 1px solid #d4dae1; vertical-align:top; }
  .ms-cover-table td:first-child { width: 38%; color:#5b6b80; font-weight:600; font-size:9pt; letter-spacing:0.5px; }
  .ms-cover-table td:last-child { font-weight:600; color:#0d1b2a; }
  .ms-cover-foot { margin-top:auto; padding-top: 10mm; border-top: 1px solid #d4dae1; color:#5b6b80; font-size:8pt; }
  .ms-distributor { margin-top: 5mm; padding: 4mm; background: #f6f8fb; border-left: 3px solid #c1272d; line-height: 1.5; }
  .ms-dist-row1 { font-weight: 700; color: #0d1b2a; font-size: 9pt; margin-bottom: 1mm; }
  .ms-dist-row2 { color: #3d4f63; font-size: 8.4pt; margin-bottom: 1mm; }
  .ms-dist-row3 { color: #7a8694; font-size: 7.4pt; font-style: italic; }

  .ms-header { display:flex; justify-content:space-between; align-items:baseline; padding-bottom:3mm; border-bottom: 1.5px solid #0d1b2a; margin-bottom:6mm; }
  .ms-header-l { font-family:'Barlow Condensed',sans-serif; font-size:10pt; letter-spacing:2px; text-transform:uppercase; }
  .ms-header-r { font-size:8pt; color:#5b6b80; }
  .ms-h2 { font-size: 13pt; font-weight: 700; margin: 0 0 4mm; padding-bottom:1.5mm; border-bottom:1px solid #aab4c0; letter-spacing:-0.3px; }
  .ms-h2:not(:first-child) { margin-top: 8mm; }
  .ms-p { margin: 0 0 3mm; }
  .ms-tbl { width:100%; border-collapse:collapse; margin: 2mm 0 4mm; font-size: 9pt; }
  .ms-tbl th, .ms-tbl td { border: 0.5pt solid #aab4c0; padding: 2mm 3mm; text-align:left; vertical-align: top; }
  .ms-tbl th { background:#e8edf3; font-weight:700; font-size:8.5pt; }
  .ms-tbl td.num { text-align:right; font-variant-numeric: tabular-nums; }
  ul.ms-ul { margin: 0 0 3mm 5mm; padding: 0; }
  ul.ms-ul li { margin-bottom: 1.5mm; }

  .ms-step-tbl { width:100%; border-collapse: collapse; margin-top: 3mm; }
  .ms-step-tbl tr { border-bottom: 0.5pt solid #c2cbd6; page-break-inside: avoid; }
  .ms-step-tbl td { padding: 3.5mm 3mm; vertical-align: top; }
  .ms-step-num { width: 12mm; font-family:'Barlow Condensed',sans-serif; font-size: 18pt; font-weight: 700; color:#0066cc; line-height:1; padding-top: 3.5mm !important; }
  .ms-step-title { font-weight: 700; font-size: 11pt; margin-bottom: 2mm; color:#0d1b2a; }
  .ms-step-grid { display: grid; grid-template-columns: 1fr 95mm; gap: 5mm; align-items: start; }
  .ms-step-text { min-width: 0; }
  .ms-step-row { display:flex; gap: 4mm; margin-bottom: 1.5mm; font-size: 8.8pt; line-height:1.5; }
  .ms-step-lbl { flex: 0 0 22mm; font-weight:600; color:#5b6b80; text-transform:uppercase; font-size:7.8pt; letter-spacing:0.5px; padding-top: 0.4mm; }
  .ms-step-draw { background:#fafbfc; border: 0.5pt solid #aab4c0; border-radius:1.5mm; padding:2mm; min-height: 50mm; }
  .ms-step-draw svg { width:100%; height: 50mm; display:block; }

  .ms-ppe-tbl td, .ms-ppe-tbl th { font-size: 8.6pt; padding: 1.8mm 2.5mm; }
  .ms-ppe-tbl td.num { text-align: center; font-weight: 600; color:#0066cc; }
  .ms-ppe-tbl td:nth-child(2) { font-weight: 600; color:#0d1b2a; }
  .ms-ppe-tbl tbody tr:nth-child(even) { background: #f6f8fb; }
  .ms-ppe-note { font-size:8.5pt; color:#5b6b80; margin: 3mm 0 0; padding: 2mm 3mm; background:#fff8e6; border-left: 2pt solid #f9b234; line-height: 1.5; }

  .ms-drawing-wrap { background:#f6f8fb; border:1px solid #aab4c0; border-radius:2mm; padding: 5mm; margin: 4mm 0; }
  .ms-drawing-title { font-weight:700; font-size:9.5pt; margin-bottom: 3mm; color:#0d1b2a; }
  .ms-drawing-wrap svg { width:100%; height:auto; max-height: 95mm; display:block; }

  .ms-sign-grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; margin-top: 8mm; }
  .ms-sign-box { border: 1pt solid #0d1b2a; padding: 4mm; min-height: 38mm; display:flex; flex-direction:column; }
  .ms-sign-box-title { font-weight: 700; font-size:9.5pt; margin-bottom: 4mm; padding-bottom:2mm; border-bottom:1px solid #aab4c0; }
  .ms-sign-row { font-size: 8pt; color:#5b6b80; margin-bottom:1mm; }
  .ms-sign-line { flex:1; border-bottom: 1px solid #5b6b80; margin:1mm 0 5mm; }

  .ms-foot { position: running(footer); }
  @media print { body { font-size: 9.5pt; } }
</style>
</head>
<body onload="setTimeout(function(){window.print();}, 600);">

<!-- ============ PAGE 1 — COVER ============ -->
<div class="page ms-cover">
  <div class="ms-cover-top">
    <div class="ms-brand">${t.ms_subtitle}</div>
  </div>
  <h1>${t.ms_title}</h1>
  <h2>${cl.project || ''}</h2>
  <table class="ms-cover-table">
    <tr><td>${t.ms_doc_no}</td><td>${docNo}</td></tr>
    <tr><td>${t.ms_rev}</td><td>0</td></tr>
    <tr><td>${t.ms_pi_date}</td><td>${dateStr}</td></tr>
    <tr><td>${t.ms_pi_client}</td><td>${cl.name || '—'}</td></tr>
    <tr><td>${t.ms_pi_site}</td><td>${cl.site || '—'}</td></tr>
    <tr><td>${t.ms_pi_quote}</td><td>${cl.quote_no || '—'}</td></tr>
    <tr><td>${t.ms_pi_struct}</td><td>${structLabel}</td></tr>
    <tr><td>${t.ms_pi_area}</td><td>${fmt(r.A)} m²</td></tr>
    <tr><td>${t.ms_pi_lw}</td><td>${fmt(p.length_m)} × ${fmt(p.width_m)} m</td></tr>
    <tr><td>${t.ms_pi_holes}</td><td>${fmt(r.holes)} ${lang === 'ja' ? '\u672c' : lang === 'zh' ? '\u5b54' : 'holes'}</td></tr>
    <tr><td>${t.ms_pi_pitch}</td><td>${fmt(p.pitch_m * 1000)} mm</td></tr>
  </table>
  <div class="ms-cover-foot">
    ${lang === 'ja' ? '\u672c\u8981\u9818\u66f8\u306f\u6210\u702c\u5316\u5b66\u682a\u5f0f\u4f1a\u793e\u300c\u30ca\u30eb\u30e9\u30a4\u30c8\u6ce8\u5165\u9632\u6c34\u5c64\u518d\u751f\u5de5\u6cd5 \u6a19\u6e96\u65bd\u5de5\u8981\u9818\u66f8\uff082019.6 \u6539\u8a02\uff09\u300d\u306b\u57fa\u3065\u304d\u4f5c\u6210\u3055\u308c\u3066\u3044\u307e\u3059\u3002' : lang === 'zh' ? '\u672c\u6587\u4ef6\u4f9d\u64da\u6210\u702c\u5316\u5b78\u682a\u5f0f\u6703\u793e\u300aNarulight \u6ce8\u5165\u9632\u6c34\u5c64\u518d\u751f\u5de5\u6cd5\u6a19\u6e96\u65bd\u5de5\u8981\u9818\u66f8\uff082019/6 \u7248\uff09\u300b\u7de8\u88fd\u3002' : 'This Method Statement is prepared in accordance with Narusekagaku Co., Ltd. — Standard Application Manual for Narulight Injection Waterproof Layer Regeneration Method (rev. 2019/6).'}
  </div>
  ${pageFoot}
</div>

<!-- ============ PAGE 2 — PROJECT INFO + SCOPE + MATERIALS ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>

  <h2 class="ms-h2">${t.ms_sec_project}</h2>
  <table class="ms-tbl">
    <tr><th style="width:30%">${t.ms_pi_client}</th><td>${cl.name || '—'}</td></tr>
    <tr><th>${t.ms_pi_project}</th><td>${cl.project || '—'}</td></tr>
    <tr><th>${t.ms_pi_site}</th><td>${cl.site || '—'}</td></tr>
    <tr><th>${t.ms_pi_struct}</th><td>${structLabel}</td></tr>
    <tr><th>${t.ms_pi_area}</th><td>${fmt(r.A)} m² &nbsp;( ${fmt(p.length_m)} × ${fmt(p.width_m)} m )</td></tr>
    <tr><th>${t.ms_pi_holes}</th><td>${fmt(r.holes)} &nbsp;@ ${fmt(p.pitch_m * 1000)} mm</td></tr>
  </table>

  <h2 class="ms-h2">${t.ms_sec_scope}</h2>
  <p class="ms-p">${t.ms_scope_intro}</p>
  <ul class="ms-ul">${li(t.ms_scope_items)}</ul>

  <h2 class="ms-h2">${t.ms_sec_materials}</h2>
  <table class="ms-tbl">
    <thead><tr>
      <th style="width:8%">${t.tbl_no}</th>
      <th>${t.tbl_item}</th>
      <th style="width:34%">${t.tbl_spec}</th>
      <th style="width:11%; text-align:right">${t.tbl_qty}</th>
      <th style="width:9%">${t.tbl_unit}</th>
    </tr></thead>
    <tbody>
      <tr><td class="num">1</td><td>${lang === 'ja' ? '\u30ca\u30eb\u30e9\u30a4\u30c8\u6ce8\u5165\u6750' : lang === 'zh' ? 'Narulight \u6ce8\u5165\u6750' : 'Narulight injection resin'}</td><td>${lang === 'ja' ? '\u6c34\u6027\u7279\u6b8a\u6a39\u8102' : lang === 'zh' ? '\u6c34\u6027\u7279\u6b8a\u6a39\u8102' : 'Water-based resin'}</td><td class="num">${fmt(r.naru_kg)}</td><td>kg</td></tr>
      <tr><td class="num">2</td><td>${lang === 'ja' ? '\u30a2\u30ed\u30d5\u30a3\u30c3\u30af\u30b9 MC' : lang === 'zh' ? 'Alofix MC \u786c\u5316\u4fc3\u9032\u5291' : 'Alofix MC accelerator'}</td><td>${lang === 'ja' ? '\u786c\u5316\u4fc3\u9032\u5264\u3001\u91cd\u91cf\u6bd4 15 %' : lang === 'zh' ? '\u91cd\u91cf\u6bd4 15 %' : '15 % by weight of Narulight'}</td><td class="num">${fmt(r.mc_kg)}</td><td>kg</td></tr>
      <tr><td class="num">3</td><td>${lang === 'ja' ? '\u30b3\u30eb\u30af\u6813' : lang === 'zh' ? '\u8edf\u6728\u585e' : 'Cork plug'}</td><td>${lang === 'ja' ? '\u6ce8\u5165\u5b54\u4eee\u6b62\u3081\u7528' : lang === 'zh' ? '\u6ce8\u5165\u5b54\u4eee\u5c01' : 'For temporary hole sealing'}</td><td class="num">${fmt(r.holes)}</td><td>ea</td></tr>
      <tr><td class="num">4</td><td>${lang === 'ja' ? '\u6025\u7d50\u9632\u6c34\u30e2\u30eb\u30bf\u30eb' : lang === 'zh' ? '\u901f\u51dd\u9632\u6c34\u7802\u6f3f' : 'Rapid-set waterproof mortar'}</td><td>${lang === 'ja' ? '\u5b54\u8a70\u3081\u4ed5\u4e0a\u3052' : lang === 'zh' ? '\u5b54\u9810\u5c01\u9589\u9762' : 'Final hole sealing'}</td><td class="num">${fmt(r.holes)}</td><td>${lang === 'ja' ? '\u7bb0\u6240' : lang === 'zh' ? '\u8655' : 'loc'}</td></tr>
      <tr><td class="num">5</td><td>${lang === 'ja' ? '\u30c9\u30ea\u30eb\u30d3\u30c3\u30c8 \u03c6 10\u201312 \u00d7 L80' : lang === 'zh' ? '\u9437\u982d \u03c6 10\u201312 \u00d7 L80' : 'Drill bit φ 10–12 × L80'}</td><td>${lang === 'ja' ? '\u8010\u4e45\u9650\u754c\u00d8 ' + r.drill_bits + ' \u672c' : lang === 'zh' ? '\u4f7f\u7528\u58fd\u547d \u00d8 ' + r.drill_bits + ' \u652f' : 'Approx. ' + r.drill_bits + ' bits required'}</td><td class="num">${r.drill_bits}</td><td>ea</td></tr>
    </tbody>
  </table>
  ${pageFoot}
</div>

<!-- ============ PAGE 3 — PROCEDURE 8 STEPS ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>
  <h2 class="ms-h2">${t.ms_sec_procedure}</h2>
  <table class="ms-step-tbl">${stepRows}</table>
  ${pageFoot}
</div>

<!-- ============ PAGE 4 — QA/QC + HSE + SIGN-OFF ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>

  <h2 class="ms-h2">${t.ms_sec_qaqc}</h2>
  <ul class="ms-ul">${li(t.ms_qaqc_items)}</ul>

  <h2 class="ms-h2">${t.ms_sec_hse}</h2>
  <ul class="ms-ul">${li(t.ms_hse_items)}</ul>
  ${pageFoot}
</div>

<!-- ============ PAGE 4B — PPE ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>

  <h2 class="ms-h2">${t.ms_sec_ppe}</h2>
  <p class="ms-p">${t.ms_ppe_intro}</p>
  <table class="ms-tbl ms-ppe-tbl">
    <thead><tr>
      <th style="width:8%">${t.tbl_no}</th>
      <th style="width:24%">${t.ms_ppe_item}</th>
      <th style="width:18%">${t.ms_ppe_spec}</th>
      <th>${t.ms_ppe_purpose}</th>
      <th style="width:14%">${t.ms_ppe_when}</th>
    </tr></thead>
    <tbody>${t.ms_ppe_rows.map((row,i) => `
      <tr>
        <td class="num">${i+1}</td>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <p class="ms-ppe-note">${t.ms_ppe_note}</p>
  ${pageFoot}
</div>

<!-- ============ PAGE 4C — SIGN-OFF ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>

  <h2 class="ms-h2">${t.ms_sec_signoff}</h2>
  <div class="ms-sign-grid">
    <div class="ms-sign-box">
      <div class="ms-sign-box-title">${t.ms_signoff_a}</div>
      <div class="ms-sign-row">${t.ms_sign_name}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_sig}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_date}</div><div class="ms-sign-line"></div>
    </div>
    <div class="ms-sign-box">
      <div class="ms-sign-box-title">${t.ms_signoff_b}</div>
      <div class="ms-sign-row">${t.ms_sign_name}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_sig}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_date}</div><div class="ms-sign-line"></div>
    </div>
    <div class="ms-sign-box">
      <div class="ms-sign-box-title">${t.ms_signoff_c}</div>
      <div class="ms-sign-row">${t.ms_sign_name}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_sig}</div><div class="ms-sign-line"></div>
      <div class="ms-sign-row">${t.ms_sign_date}</div><div class="ms-sign-line"></div>
    </div>
  </div>
  ${pageFoot}
</div>

<!-- ============ PAGE 5 — SHOP DRAWINGS ============ -->
<div class="page">
  <div class="ms-header">
    <div class="ms-header-l">${t.ms_title}</div>
    <div class="ms-header-r">${docNo}</div>
  </div>
  <h2 class="ms-h2">${t.ms_sec_drawings}</h2>
  <div class="ms-drawing-wrap">
    <div class="ms-drawing-title">${t.plan_title}</div>
    ${buildFloorPlan(lang, t)}
  </div>
  <div class="ms-drawing-wrap">
    <div class="ms-drawing-title">${p.structure === 'protect_with_insulation' ? t.sec_title_b : t.sec_title_a}</div>
    ${buildCrossSection(lang, t)}
  </div>
  ${pageFoot}
</div>

</body>
</html>`;

    const w = window.open('', '_blank');
    if (!w) {
      alert(lang === 'ja' ? 'ポップアップがブロックされました。ブラウザの設定をご確認ください。' :
            lang === 'zh' ? '彈出視窗被瀏覽器封鎖，請允許彈出視窗。' :
            'Popup blocked. Please allow popups for this site.');
      return;
    }
    // Substitute page numbers — count occurrences of __PG__, then replace each with sequential index
    const total = (html.match(/__PG__/g) || []).length;
    let idx = 0;
    let finalHtml = html.replace(/__PG__/g, () => String(++idx).padStart(2, '0'));
    finalHtml = finalHtml.replace(/__TOTAL__/g, String(total).padStart(2, '0'));
    w.document.open();
    w.document.write(finalHtml);
    w.document.close();
  }

  // === STYLE INJECTION ===
  function injectStyles(){
    const css = `
      .quotation-section { padding: 100px 0; background: var(--bg); border-top: 1px solid var(--border); position: relative; }
      .quotation-section .container { max-width: 1480px; }
      .q-grid { display: grid; grid-template-columns: 480px 1fr; gap: 40px; margin-top: 40px; align-items: start; }
      @media (max-width: 1180px){ .q-grid { grid-template-columns: 1fr; } }
      .q-form { display: flex; flex-direction: column; gap: 18px; position: sticky; top: 80px; max-height: calc(100vh - 100px); overflow-y: auto; overflow-x: hidden; padding-right: 8px; min-width: 0; }
      .q-form::-webkit-scrollbar { width: 6px; } .q-form::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      .q-panel { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 18px 20px; min-width: 0; }
      .q-panel-title { font-size: 13px; font-weight: 700; color: var(--accent); margin: 0 0 14px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Barlow Condensed', sans-serif; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
      .q-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; min-width: 0; }
      .q-fields label { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--sub); min-width: 0; }
      .q-fields label.q-full { grid-column: 1 / -1; }
      .q-fields input, .q-fields select { width: 100%; max-width: 100%; box-sizing: border-box; background: rgba(0,0,0,0.25); border: 1px solid var(--border); color: var(--text); padding: 7px 10px; border-radius: 4px; font-size: 12px; font-family: inherit; }
      .q-fields input:focus, .q-fields select:focus { outline: none; border-color: var(--accent); }
      .q-fields input[type="file"] { padding: 4px; font-size: 10px; }
      .q-actions { display: flex; gap: 10px; margin-top: 4px; }
      .q-actions .btn { flex: 1; justify-content: center; padding: 12px; font-size: 13px; }

      /* Send-copy modal */
      .q-send-overlay {
        position: fixed; inset: 0; background: rgba(8,14,28,0.55);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; backdrop-filter: blur(3px); padding: 20px;
      }
      .q-send-modal {
        background: #fff; border-radius: 8px; width: 100%; max-width: 520px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35); padding: 22px 24px;
        font-family: var(--font-sans, system-ui, sans-serif); color: #0a1525;
        max-height: 90vh; overflow-y: auto;
      }
      .q-send-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
      .q-send-head h3 { margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
      .q-send-close {
        background: none; border: none; font-size: 24px; line-height: 1; cursor: pointer;
        color: #888; padding: 0 4px;
      }
      .q-send-close:hover { color: #0a1525; }
      .q-send-intro { font-size: 12px; color: #555; margin: 4px 0 14px; line-height: 1.5; }
      .q-send-steps { font-size: 12px; color: #0a1525; margin: 0 0 14px; padding-left: 20px; line-height: 1.6; }
      .q-send-steps li { margin-bottom: 3px; }
      .q-send-attach-hint { font-size: 11px; color: #c1272d; background: #fff5f5; border-left: 3px solid #c1272d; padding: 6px 10px; margin: 4px 0 10px; line-height: 1.45; border-radius: 2px; }
      .q-send-field { display: block; margin-bottom: 12px; }
      .q-send-field span {
        display: block; font-size: 11px; font-weight: 600; color: #444;
        text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px;
      }
      .q-send-field input,
      .q-send-field textarea {
        width: 100%; padding: 8px 10px; font-size: 13px; border: 1px solid #cfd6df;
        border-radius: 4px; box-sizing: border-box; font-family: inherit; color: #0a1525;
        background: #fafbfc;
      }
      .q-send-field textarea { resize: vertical; min-height: 140px; line-height: 1.45; font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; }
      .q-send-field input:focus,
      .q-send-field textarea:focus { outline: none; border-color: var(--accent, #c1272d); background: #fff; }
      .q-send-actions { display: flex; gap: 10px; margin-top: 14px; }
      .q-send-actions .btn { flex: 1; justify-content: center; padding: 10px; font-size: 13px; }
      .q-send-status { margin-top: 10px; font-size: 12px; min-height: 16px; }
      .q-send-status.ok { color: #1a7a3a; }
      .q-send-status.err { color: #c1272d; }

      /* Contractor button + modal */
      .btn.btn-contractor {
        background: #6b1d1d; color: #fff; border: 1px solid #6b1d1d;
        font-weight: 600;
      }
      .btn.btn-contractor:hover { background: #862626; border-color: #862626; }
      .q-contractor-modal { max-width: 720px; width: 92vw; }
      .q-contractor-modal #qContrMessage {
        font-family: 'SF Mono', 'Menlo', 'Consolas', 'Courier New', monospace;
        font-size: 11px; line-height: 1.5; white-space: pre;
      }
      .q-contractor-warn {
        background: #fdecec; border: 1px solid #c1272d; color: #6b1d1d;
        padding: 8px 12px; margin: 0 0 12px; border-radius: 3px;
        font-size: 12px; font-weight: 600; line-height: 1.45;
      }

      /* Client button + modal */
      .btn.btn-client {
        background: #1a4d8c; color: #fff; border: 1px solid #1a4d8c;
        font-weight: 600;
      }
      .btn.btn-client:hover { background: #2462ad; border-color: #2462ad; }
      .q-client-modal { max-width: 680px; width: 92vw; }
      .q-client-modal #qClientMessage {
        font-family: 'SF Mono', 'Menlo', 'Consolas', 'Courier New', monospace;
        font-size: 11px; line-height: 1.5; white-space: pre;
      }

      .q-preview-wrap { }
      .q-preview-label { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Barlow Condensed', sans-serif; }
      .q-a4-frame { background: #2a3340; padding: 24px; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); overflow: auto; max-height: calc(100vh - 60px); }
      .q-a4 { width: 794px; min-height: 1123px; background: #fff; color: #0a1525; padding: 50px 50px; font-family: 'Noto Sans TC','Noto Sans JP','Inter',sans-serif; font-size: 11px; line-height: 1.5; margin: 0 auto; }

      .qa4-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0a1525; padding-bottom: 14px; margin-bottom: 18px; }
      .qa4-issuer { display: flex; gap: 14px; align-items: center; max-width: 60%; }
      .q-logo-img { max-height: 60px; max-width: 140px; object-fit: contain; }
      .q-logo-placeholder { width: 90px; height: 60px; border: 1px dashed #888; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #888; letter-spacing: 2px; }
      .qa4-issuer-name { font-weight: 700; font-size: 14px; margin-bottom: 3px; color: #0a1525; }
      .qa4-issuer-line { font-size: 10px; color: #444; line-height: 1.6; }
      .qa4-title-block { text-align: right; }
      .qa4-title { font-size: 28px; font-weight: 800; letter-spacing: 8px; margin-bottom: 8px; color: #0a1525; }
      .qa4-meta { font-size: 11px; color: #444; }
      .qa4-meta div { margin-bottom: 3px; }
      .qa4-meta span { margin-right: 8px; color: #888; }
      .qa4-meta b { color: #0a1525; font-weight: 600; }

      .qa4-client { margin-bottom: 14px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
      .qa4-client-name { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: #0a1525; }
      .qa4-honor { font-size: 12px; font-weight: 400; color: #666; margin-left: 8px; }
      .qa4-subject { font-size: 12px; color: #444; }
      .qa4-subject b { color: #0a1525; font-weight: 600; }
      .qa4-site { font-size: 11px; color: #666; margin-top: 3px; }
      .qa4-greet { font-size: 11px; color: #444; margin-top: 10px; line-height: 1.6; }
      .qa4-greet p { margin: 0 0 4px; }
      .qa4-greet p:first-child { font-weight: 600; color: #0a1525; }

      .qa4-plan { margin: 10px 0 14px; border: 1px solid #d8dee5; border-radius: 6px; padding: 10px 12px; background: #fafbfc; }
      .qa4-plan-title { font-size: 11px; font-weight: 700; color: #0a1525; letter-spacing: 1.5px; margin-bottom: 6px; text-transform: uppercase; }
      .qa4-plan-svg { width: 100%; height: auto; display: block; background: #fff; border: 1px solid #e8edf3; border-radius: 3px; }
      .qa4-plan-stats { display: flex; gap: 16px; flex-wrap: wrap; font-size: 10px; color: #444; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #d8dee5; }
      .qa4-plan-stats i { font-style: normal; color: #888; margin-right: 4px; }
      .qa4-plan-stats span { white-space: nowrap; }

      .qa4-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; color: #0a1525; }
      .qa4-table th { background: #0a1525; color: #fff; padding: 8px 6px; font-size: 11px; font-weight: 600; text-align: left; border: 1px solid #0a1525; }
      .qa4-table th:nth-child(1), .qa4-table th:nth-child(5) { text-align: center; }
      .qa4-table th:nth-child(4), .qa4-table th:nth-child(6), .qa4-table th:nth-child(7) { text-align: right; }
      .qa4-table td { padding: 6px; border: 1px solid #d0d6dd; font-size: 11px; vertical-align: top; }
      .qa4-table td.c { text-align: center; }
      .qa4-table td.r { text-align: right; font-variant-numeric: tabular-nums; }
      .qa4-table td.spec { font-size: 10px; color: #666; }
      .sec-row td { background: #eef2f7 !important; font-weight: 700; color: #0a1525; font-size: 11px; padding: 6px 8px; letter-spacing: 0.5px; }
      .tot-row td { background: #f8f9fb !important; font-weight: 600; }
      .tot-row.grand td { background: #0a1525 !important; color: #fff; font-size: 14px; padding: 10px 8px; letter-spacing: 1px; }

      .qa4-summary { margin: 12px 0; display: flex; justify-content: flex-end; }
      .qa4-key { background: #0a1525; color: #fff; padding: 14px 22px; text-align: right; }
      .qa4-key-label { font-size: 11px; opacity: 0.7; letter-spacing: 1.5px; text-transform: uppercase; }
      .qa4-key-val { font-size: 24px; font-weight: 800; margin: 4px 0; letter-spacing: 0.5px; }
      .qa4-key-unit { font-size: 10px; opacity: 0.7; }

      .qa4-notes { margin-top: 18px; border-top: 1px solid #ddd; padding-top: 10px; color: #0a1525; }
      .qa4-notes-title { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
      .qa4-notes ul { margin: 0; padding-left: 18px; font-size: 10.5px; color: #444; line-height: 1.7; }

      .qa4-sigs { display: flex; gap: 40px; margin-top: 36px; }
      .qa4-sig { flex: 1; }
      .qa4-sig-label { font-size: 11px; color: #666; margin-bottom: 24px; }
      .qa4-sig-line { border-top: 1px solid #0a1525; }

      .qa4-footer { margin-top: 18px; border-top: 1px solid #eee; padding-top: 8px; font-size: 9.5px; color: #888; }
      .qa4-foot-note { text-align: center; margin-bottom: 5px; }
      .qa4-foot-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .qa4-foot-l { flex: 1 1 auto; min-width: 0; font-size: 9px; color: #7a8694; }
      .qa4-foot-r { flex: 0 0 auto; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 1.5px; font-weight: 600; font-size: 10.5px; color: #3d4f63; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // === INIT ===
  function init(){
    injectStyles();
    const sec = buildSection();
    // Insert before footer (or at end of body if no footer)
    const footer = document.querySelector('footer');
    if(footer){ footer.parentNode.insertBefore(sec, footer); }
    else { document.body.appendChild(sec); }

    buildPanels();
    bindInputs();
    renderPreview();

    // Re-render on language change
    const observer = new MutationObserver(() => {
      buildPanels();
      bindInputs();
      renderPreview();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    // Sync with diagram model toggle: A ↔ protect_no_insulation, B ↔ protect_with_insulation
    document.addEventListener('roofModelChange', (e) => {
      const m = e.detail.model;
      const next = (m === 'B') ? 'protect_with_insulation' : 'protect_no_insulation';
      if(STATE.project.structure !== next){
        STATE.project.structure = next;
        // If switching to A, force insulation off
        if(m === 'A'){
          STATE.project.insulation_type = 'none';
          STATE.project.insulation_thickness = 0;
        } else if(STATE.project.insulation_type === 'none'){
          STATE.project.insulation_type = 'xps';
          STATE.project.insulation_thickness = 50;
        }
        buildPanels(); bindInputs(); applyInsVis(); renderPreview();
      }
    });
    // Quotation → diagram (when user changes structure dropdown)
    document.addEventListener('change', (e) => {
      if(e.target && e.target.id === 'qStructureSel'){
        const m = (e.target.value === 'protect_with_insulation') ? 'B' : (e.target.value === 'protect_no_insulation') ? 'A' : null;
        if(m && typeof window.applyModel === 'function' && window.currentRoofModel !== m){
          window.applyModel(m);
        }
        applyInsVis();
      }
    });
    function applyInsVis(){
      const sel = document.getElementById('qStructureSel');
      const isB = sel && sel.value === 'protect_with_insulation';
      document.querySelectorAll('.q-ins-row').forEach(r => {
        r.style.opacity = isB ? '1' : '0.4';
        r.style.pointerEvents = isB ? 'auto' : 'none';
      });
    }
    applyInsVis();

    // Add nav link
    const navLinks = document.querySelector('.nav-links');
    if(navLinks){
      const a = document.createElement('a');
      a.href = '#quotation';
      a.dataset.i18n = 'nav.quote';
      a.textContent = getLang()==='zh'?'報價':getLang()==='en'?'Quote':'見積';
      navLinks.appendChild(a);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
