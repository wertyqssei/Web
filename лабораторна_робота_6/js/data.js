const products = [
    {
        id: 1,
        name: "Смартфон Samsung Galaxy A54",
        category: "Смартфони",
        price: 14999,
        rating: 4.7,
        inStock: true,
        image: "https://dummyimage.com/300x200/4d90fe/ffffff&text=Samsung+Galaxy+A54"
    },
    {
        id: 2,
        name: "Ноутбук ASUS VivoBook",
        category: "Ноутбуки",
        price: 24999,
        rating: 4.5,
        inStock: true,
        image: "https://dummyimage.com/300x200/007bff/ffffff&text=ASUS+VivoBook"
    },
    {
        id: 3,
        name: "Планшет Apple iPad Air",
        category: "Планшети",
        price: 19999,
        rating: 4.8,
        inStock: true,
        image: "https://dummyimage.com/300x200/c6c6c6/000000&text=iPad+Air"
    },
    {
        id: 4,
        name: "Навушники Sony WH-1000XM4",
        category: "Аудіо",
        price: 9999,
        rating: 4.9,
        inStock: true,
        image: "https://dummyimage.com/300x200/000000/ffffff&text=Sony+WH-1000XM4"
    },
    {
        id: 5,
        name: "Смарт-годинник Apple Watch Series 8",
        category: "Гаджети",
        price: 17999,
        rating: 4.6,
        inStock: false,
        image: "https://dummyimage.com/300x200/000000/ffffff&text=Apple+Watch+S8"
    },
    {
        id: 6,
        name: "Телевізор Samsung QLED 55\"",
        category: "Телевізори",
        price: 29999,
        rating: 4.4,
        inStock: true,
        image: "https://dummyimage.com/300x200/0a3d62/ffffff&text=Samsung+QLED+55"
    },
    {
        id: 7,
        name: "Фотоапарат Canon EOS R10",
        category: "Фото та відео",
        price: 42999,
        rating: 4.7,
        inStock: true,
        image: "https://dummyimage.com/300x200/d63031/ffffff&text=Canon+EOS+R10"
    },
    {
        id: 8,
        name: "Ігрова консоль PlayStation 5",
        category: "Ігрові консолі",
        price: 22999,
        rating: 4.9,
        inStock: false,
        image: "https://dummyimage.com/300x200/2e86de/ffffff&text=PlayStation+5"
    },
    {
        id: 9,
        name: "Смартфон iPhone 14 Pro",
        category: "Смартфони",
        price: 39999,
        rating: 4.8,
        inStock: true,
        image: "https://dummyimage.com/300x200/000000/ffffff&text=iPhone+14+Pro"
    },
    {
        id: 10,
        name: "Ноутбук Apple MacBook Air",
        category: "Ноутбуки",
        price: 44999,
        rating: 4.7,
        inStock: true,
        image: "https://dummyimage.com/300x200/c6c6c6/000000&text=MacBook+Air"
    },
    {
        id: 11,
        name: "Бездротова колонка JBL Charge 5",
        category: "Аудіо",
        price: 4999,
        rating: 4.5,
        inStock: true,
        image: "https://dummyimage.com/300x200/ff5722/ffffff&text=JBL+Charge+5"
    },
    {
        id: 12,
        name: "Монітор Dell S2722DGM",
        category: "Комп'ютерна техніка",
        price: 12999,
        rating: 4.3,
        inStock: true,
        image: "https://dummyimage.com/300x200/333333/ffffff&text=Dell+S2722DGM"
    },
    {
        id: 13,
        name: "Клавіатура Logitech G Pro X",
        category: "Комп'ютерна техніка",
        price: 3999,
        rating: 4.6,
        inStock: true,
        image: "https://dummyimage.com/300x200/0a3d62/ffffff&text=Logitech+G+Pro+X"
    },
    {
        id: 14,
        name: "Миша Razer DeathAdder V2",
        category: "Комп'ютерна техніка",
        price: 2499,
        rating: 4.4,
        inStock: false,
        image: "https://dummyimage.com/300x200/00b894/ffffff&text=Razer+DeathAdder+V2"
    },
    {
        id: 15,
        name: "Смартфон Xiaomi Redmi Note 12",
        category: "Смартфони",
        price: 8999,
        rating: 4.2,
        inStock: true,
        image: "https://dummyimage.com/300x200/ff6b6b/ffffff&text=Xiaomi+Redmi+Note+12"
    },
    {
        id: 16,
        name: "Навушники Apple AirPods Pro",
        category: "Аудіо",
        price: 8499,
        rating: 4.7,
        inStock: true,
        image: "https://dummyimage.com/300x200/ffffff/000000&text=AirPods+Pro"
    },
    {
        id: 17,
        name: "Телевізор LG OLED C2 65\"",
        category: "Телевізори",
        price: 59999,
        rating: 4.9,
        inStock: false,
        image: "https://dummyimage.com/300x200/2d3436/ffffff&text=LG+OLED+C2+65"
    },
    {
        id: 18,
        name: "Планшет Samsung Galaxy Tab S8",
        category: "Планшети",
        price: 22999,
        rating: 4.5,
        inStock: true,
        image: "https://dummyimage.com/300x200/4a69bd/ffffff&text=Galaxy+Tab+S8"
    },
    {
        id: 19,
        name: "Робот-пилосос Xiaomi Mi Robot Vacuum",
        category: "Побутова техніка",
        price: 7499,
        rating: 4.3,
        inStock: true,
        image: "https://dummyimage.com/300x200/e84118/ffffff&text=Mi+Robot+Vacuum"
    },
    {
        id: 20,
        name: "Кавомашина Philips EP2231/40",
        category: "Побутова техніка",
        price: 13999,
        rating: 4.4,
        inStock: true,
        image: "https://dummyimage.com/300x200/706fd3/ffffff&text=Philips+EP2231"
    }
]; 