import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const STATUS_OPTION = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'complete', label: 'Complete' },
];

export const ALL_CLIENTS = [
  {
    id: '1',
    name: 'Acme Corporation',
  },
  {
    id: '2',
    name: 'Globex Industries',
  },
  {
    id: '3',
    name: 'Initech Solutions',
  },
  {
    id: '4',
    name: 'Umbrella Corp',
  },
  {
    id: '5',
    name: 'Wayne Enterprises',
  },
  {
    id: '6',
    name: 'Stark Industries',
  },
  {
    id: '7',
    name: 'Cyberdyne Systems',
  },
  {
    id: '8',
    name: 'Tyrell Corporation',
  },
  {
    id: '9',
    name: 'Wonka Industries',
  },
  {
    id: '10',
    name: 'Hooli',
  },
];

export const ALL_MANAGERS = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    department: 'Sales',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    department: 'Marketing',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    department: 'Operations',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    department: 'HR',
  },
  {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    department: 'Security',
  },
  {
    id: '6',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@example.com',
    department: 'Finance',
  },
  {
    id: '7',
    name: 'George Costanza',
    email: 'george.costanza@example.com',
    department: 'Logistics',
  },
  {
    id: '8',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@example.com',
    department: 'Customer Support',
  },
  {
    id: '9',
    name: 'Isaac Clarke',
    email: 'isaac.clarke@example.com',
    department: 'Engineering',
  },
  {
    id: '10',
    name: 'Julia Roberts',
    email: 'julia.roberts@example.com',
    department: 'Product Management',
  },
];

const ITEMS = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
}));

export const projects = [
  {
    id: '1',
    name: 'Field Sales Optimization',
    client: 'ABC Corp',
    createdAt: '2024-01-15',
    campaigns: 5,
    startDate: '2024-02-01',
    endDate: '2024-06-30',
  },
  {
    id: '2',
    name: 'Retail POS Upgrade',
    client: 'XYZ Retail',
    createdAt: '2024-03-10',
    campaigns: 3,
    startDate: '2024-04-01',
    endDate: '2024-09-30',
  },
  {
    id: '3',
    name: 'Gamified Sales Platform',
    client: 'Hokela Ltd',
    createdAt: '2024-05-20',
    campaigns: 7,
    startDate: '2024-06-15',
    endDate: '2024-12-31',
  },
  {
    id: '4',
    name: 'Survey & Reporting System',
    client: 'Data Insights Inc.',
    createdAt: '2024-02-05',
    campaigns: 4,
    startDate: '2024-02-20',
    endDate: '2024-07-31',
  },
  {
    id: '5',
    name: 'Telegram Mini App Integration',
    client: 'Social Connect',
    createdAt: '2024-06-01',
    campaigns: 6,
    startDate: '2024-07-10',
    endDate: '2024-12-01',
  },
];

export const _orders = [...Array(20)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subtotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = { shipBy: 'DHL', speedy: 'Standard', trackingNumber: 'SPX037739199373' };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      { title: 'The shipping unit has picked up the goods', time: _mock.time(4) },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    id: _mock.id(index),
    orderNumber: `#601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subtotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});
