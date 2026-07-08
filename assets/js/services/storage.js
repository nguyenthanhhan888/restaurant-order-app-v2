import { CONFIG } from '../config.js';

const getInitialData = () => ({
    suppliers: [
        { id: "sup_metro", name: "Metro" },
        { id: "sup_edeka", name: "EDEKA" },
        { id: "sup_asia", name: "Châu Á" },
        { id: "sup_japan", name: "Đồ Nhật" }
    ],
    groups: [
        { id: "grp_rau", name: "Hàng Rau", supplierId: "sup_metro" },
        { id: "grp_kho", name: "Hàng Khô", supplierId: "sup_metro" },
        { id: "grp_vs", name: "Vệ Sinh", supplierId: "sup_metro" },
        { id: "grp_thit", name: "Thịt", supplierId: "sup_metro" }
    ],
    items: [
        // Metro
        { id: "itm_minze_metro", name: "Minze", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_hanhla_metro", name: "Hành lá", unit: "Túi", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_salatdo_metro", name: "Salat đỏ", unit: "Túi", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_chanh_metro", name: "Chanh", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_cam_metro", name: "Cam", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_tao_metro", name: "Táo", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_thymian_metro", name: "Thymian", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_otsung_metro", name: "Ớt sừng", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_catim_metro", name: "Cà tím", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_rosmarin_metro", name: "Rosmarin", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_toicu_metro", name: "Tỏi củ", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_khoailang_metro", name: "Khoai lang", unit: "Kít", supplierId: "sup_metro", groupId: "grp_rau" },
        { id: "itm_dauan_metro", name: "Dầu ăn", unit: "Kít", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_duongvang_metro", name: "Đường vàng", unit: "Kít", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_duongtrang_metro", name: "Đường trắng", unit: "Kít", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_giaysusi_metro", name: "Giấy Susi", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_schlagsahne_metro", name: "Schlagsahne", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_speisequark_metro", name: "Speisequark", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_mascarpone_metro", name: "Mascarpone", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_kemchanh_metro", name: "Kem chanh", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_banhsoke_metro", name: "Bánh Soke", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_kemvanilla_metro", name: "Kem Vanilla", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_frischkase_metro", name: "Frisch Käse", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_banhtaquito_metro", name: "Bánh Taquito", unit: "TÚI", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_cahunkhoi_metro", name: "Cá hun khói", unit: "Miếng", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_ngohop_metro", name: "Ngô hộp", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_sua35_metro", name: "Sữa 3.5%", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_maggi_metro", name: "Maggi", unit: "Chai", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_muoi_metro", name: "Muối", unit: "Kg", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_mi_metro", name: "Mì", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_kemdua_metro", name: "Kem Dừa", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_hatieu_metro", name: "Hạt tiêu", unit: "KG", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_otbot_metro", name: "Ớt bột", unit: "Túi", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_bachtuoc_metro", name: "Bạch Tuộc", unit: "Con", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_banhschoko_metro", name: "Bánh Schoko", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_schokososse_metro", name: "Schoko Sosse", unit: "Chai", supplierId: "sup_metro", groupId: "grp_kho" },
        { id: "itm_nuaruachen_metro", name: "Nước rửa chén", unit: "Can", supplierId: "sup_metro", groupId: "grp_vs" },
        { id: "itm_nualaukinh_metro", name: "Nước lau kính", unit: "Can", supplierId: "sup_metro", groupId: "grp_vs" },
        { id: "itm_nuaruatay_metro", name: "Nước rửa tay của khách", unit: "Can", supplierId: "sup_metro", groupId: "grp_vs" },
        { id: "itm_fettloser_metro", name: "Fettlöser", unit: "Can", supplierId: "sup_metro", groupId: "grp_vs" },
        { id: "itm_thitbonam_metro", name: "Thịt bò nạm", unit: "Túi", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_boudon_metro", name: "Bò Udon", unit: "Túi", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_boxao_metro", name: "Bò xào", unit: "Túi", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_vit_metro", name: "Vịt", unit: "Túi", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_ucga_metro", name: "Ức gà", unit: "Túi", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_duiga_metro", name: "Đùi gà", unit: "Hộp", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_thucannv_metro", name: "Thức ăn nhân viên", unit: "Kg", supplierId: "sup_metro", groupId: "grp_thit" },
        { id: "itm_trungga_metro", name: "Trứng gà", unit: "Kít", supplierId: "sup_metro", groupId: "grp_thit" },
        // EDEKA
        { id: "itm_trung", name: "Trứng", unit: "vỉ", supplierId: "sup_edeka", groupId: null },
        { id: "itm_brokkoli", name: "Brokkoli", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_pakchoi", name: "Pak Choi", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_kleinermais", name: "Kleiner Mais", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_zuckererbsen", name: "Zuckererbsen", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_mixsalat", name: "Mix Salat", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_krauterseitling", name: "Kräuterseitling", unit: "kg", supplierId: "sup_edeka", groupId: null },
        { id: "itm_babyspinat", name: "Babyspinat", unit: "túi", supplierId: "sup_edeka", groupId: null },
        { id: "itm_normalerspinat", name: "Normaler Spinat", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_tomaten", name: "Tomaten", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_spargel", name: "Spargel", unit: "Bó", supplierId: "sup_edeka", groupId: null },
        { id: "itm_paprika", name: "Paprika", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_karotten", name: "Karotten", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_avocado", name: "Avocado", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_mango", name: "Mango", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_rettich", name: "Rettich", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_gurke", name: "Gurke", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_schnittlauch", name: "Schnittlauch", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_dill", name: "Dill", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_shisomix", name: "Shiso Mix", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_kumquat", name: "Kumquat", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_kurbis", name: "Kürbis", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_susskartofel", name: "Süsskartofel", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_romytomaten", name: "Romy Tomaten", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_rucola", name: "Rucola", unit: "Kit", supplierId: "sup_edeka", groupId: null },
        { id: "itm_knoblauch", name: "Knoblauch", unit: "Bì", supplierId: "sup_edeka", groupId: null },
        { id: "itm_sake", name: "Sake (Rượu Sake)", unit: "Thùng", supplierId: "sup_japan", groupId: null },
        { id: "itm_yuzusaft", name: "Yuzu Saft", unit: "Gói", supplierId: "sup_japan", groupId: null },
        { id: "itm_tobikoorange", name: "Tobiko Orange (Trứng cá chuồn màu cam)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_surimimaki", name: "Surimi Maki Sticks (Thanh cua cuộn maki)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_unagikabayaki", name: "Unagi Kabayaki (Lươn nướng sốt)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_kikkoman", name: "Kikkoman (Nước tương Kikkoman)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_sakechien", name: "Sake chiên bán (Sake chiên)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_sakelau", name: "Sake lẩu", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_misoweiss", name: "Miso Weiss (Tương miso trắng)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_sushiyotakuan", name: "Sushiyo Takuan (Củ cải vàng muối)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_katsuobushi", name: "Katsuobushi (Cá bào Nhật Bản)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_honteri", name: "Honteri (Rượu gia vị Mirin Honteri)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_suehiro", name: "Suehiro", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_miola", name: "Miola", unit: "Lọ", supplierId: "sup_japan", groupId: null },
        { id: "itm_gaosushi", name: "Gạo Sushi", unit: "Bao", supplierId: "sup_japan", groupId: null },
        { id: "itm_gyozachicken", name: "Gyoza Chicken (Bánh xếp nhân gà)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_dashinomoto", name: "Dashinomoto (Bột cá cốt súp)", unit: "Hộp", supplierId: "sup_japan", groupId: null },
        { id: "itm_silkentofu", name: "Silken Tofu Firm (Đậu phụ lụa nấu súp)", unit: "Hộp (10)", supplierId: "sup_japan", groupId: null },
        { id: "itm_wakame", name: "Wakame (Rong biển khô)", unit: "Thùng", supplierId: "sup_japan", groupId: null },
        { id: "itm_tom2125", name: "Tôm 21/25", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_tom1315", name: "Tôm 13/15", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_gomawakame", name: "Goma Wakame (Rong biển trộn mè)", unit: "gói", supplierId: "sup_japan", groupId: null },
        { id: "itm_mayonnaisejp", name: "Mayonnaise (Sốt Mayonnaise Nhật)", unit: "Thùng (T)", supplierId: "sup_japan", groupId: null },
        { id: "itm_botchienjp", name: "Bột chiên", unit: "bao 20kg", supplierId: "sup_japan", groupId: null },
        { id: "itm_biaasahi", name: "Bia Asahi", unit: "Thùng", supplierId: "sup_japan", groupId: null },
        { id: "itm_edamame", name: "Edamame (Đậu nành Nhật Bản)", unit: "Thùng", supplierId: "sup_japan", groupId: null },
        { id: "itm_udon", name: "Udon", unit: "Thùng", supplierId: "sup_japan", groupId: null },
        { id: "itm_crabjp", name: "Crab", unit: "hộp", supplierId: "sup_japan", groupId: null },
        { id: "itm_gao_asia", name: "Gạo", unit: "Bao", supplierId: "sup_asia", groupId: null },
        { id: "itm_mitom_asia", name: "Mì tôm", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_bun_asia", name: "Bún", unit: "Gói", supplierId: "sup_asia", groupId: null },
        { id: "itm_sa_asia", name: "Sả", unit: "Gói", supplierId: "sup_asia", groupId: null },
        { id: "itm_gung_asia", name: "Gừng", unit: "Kg", supplierId: "sup_asia", groupId: null },
        { id: "itm_dauhao_asia", name: "Dầu hào", unit: "Chai", supplierId: "sup_asia", groupId: null },
        { id: "itm_vung_asia", name: "Vừng (Mè)", unit: "Chai", supplierId: "sup_asia", groupId: null },
        { id: "itm_hatnem_asia", name: "Hạt nêm", unit: "Gói", supplierId: "sup_asia", groupId: null },
        { id: "itm_michinh_asia", name: "Mì chính (Bột ngọt)", unit: "Can", supplierId: "sup_asia", groupId: null },
        { id: "itm_nuocmam_asia", name: "Nước mắm", unit: "Can", supplierId: "sup_asia", groupId: null },
        { id: "itm_mango_asia", name: "Mango (Xoài)", unit: "Hộp", supplierId: "sup_asia", groupId: null },
        { id: "itm_tofu_asia", name: "Tofu (Đậu phụ)", unit: "Hộp", supplierId: "sup_asia", groupId: null },
        { id: "itm_tuongot_asia", name: "Tương ớt con ngỗng (Sriracha)", unit: "Chai", supplierId: "sup_asia", groupId: null },
        { id: "itm_chethai_asia", name: "Chè Thái Nguyên", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_dumplingveg_asia", name: "Dumpling vegetable (Há cảo chay)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_lychee_asia", name: "Lychee (Vải thiều)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_aloeking_asia", name: "Aloe King (Nước nha đam)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_mukimame_asia", name: "Mukimame / Edamame (Đậu nành edamame đông đá)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_chilipaste_asia", name: "Chili paste / Đậu bản tương (Dầu đậu Tàu)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_chagioga_asia", name: "Chả giò gà", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_hacaotom_asia", name: "Há cảo tôm", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_mi_asia", name: "Mì", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_caphe_asia", name: "Cà phê", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_daume_asia", name: "Dầu mè (Dầu vừng)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_erdnusscreme_asia", name: "Erdnusscreme (Bơ đậu phộng)", unit: "Thùng", supplierId: "sup_asia", groupId: null },
        { id: "itm_hoi_asia", name: "Hồi / Tía tô (Hồi sim)", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_botchienxu_asia", name: "Bột chiên xù", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_sambal_asia", name: "Sambal Oelek (Chili sốt ớt)", unit: "Gói", supplierId: "sup_asia", groupId: null },
        { id: "itm_ga_asia", name: "Gà", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_tomboc_asia", name: "Tôm bọc khoai tây", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_riengda_asia", name: "Riềng đá (Riềng đông lạnh)", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_xidaudac_asia", name: "Xì dầu đặc (Hắc xì dầu)", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_xidauloang_asia", name: "Xì dầu loãng", unit: "GÓI", supplierId: "sup_asia", groupId: null },
        { id: "itm_phongtom_asia", name: "Phồng tôm", unit: "GÓI", supplierId: "sup_asia", groupId: null }
    ],
    orders: []
});

export const init = () => {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!data) {
        console.log("No data found in LocalStorage. Initializing with sample data.");
        saveData(getInitialData());
    } else {
        console.log("Data found in LocalStorage.");
    }
};

export const getData = () => {
    try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEY);
        return data ? JSON.parse(data) : getInitialData();
    } catch (error) {
        console.error("Error parsing data from LocalStorage:", error);
        return getInitialData();
    }
};

export const saveData = (data) => {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
};

console.log("storage.js loaded");