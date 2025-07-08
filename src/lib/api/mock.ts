export const mockApi = {
  // 브랜드 관련
  getBrands: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    return {
      success: true,
      brands: [
        { id: 1, title: 'Tom Ford', description: '럭셔리 향수' },
        { id: 2, title: 'Chanel', description: '프렌치 엘레강스' },
      ],
    };
  },

  // 제품 관련
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      products: [
        { id: 1, title: 'Black Orchid', price: 250000, brandId: 1 },
        { id: 2, title: 'Santal 33', price: 380000, brandId: 2 },
      ],
    };
  },

  // 매거진 관련
  getMagazines: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      magazines: [
        { id: 1, title: '향수 가이드', content: '계절별 향수 선택법', brandId: 1 },
        { id: 2, title: '브랜드 스토리', content: '우리의 여정', brandId: 2 },
      ],
    };
  },
};