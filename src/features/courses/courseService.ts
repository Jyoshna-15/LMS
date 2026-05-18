import client from '../../lib/api/client'

export const fetchCourses = async () => {
  const [productsRes, usersRes] = await Promise.all([
    client.get('/api/v1/public/randomproducts?limit=20'),
    client.get('/api/v1/public/randomusers?limit=20'),
  ])

  const products = productsRes.data.data.data
  const users = usersRes.data.data.data

  return products.map((product: any, index: number) => ({
  id: String(product.id),
  title: product.title ?? 'Untitled Course',
  description: product.description ?? 'No description available',
  price: product.price ?? 0,
  category: product.category ?? 'General',
  thumbnail: `https://picsum.photos/seed/${product.id}/400/200`,
  instructor: {
    id: users[index]?._id ?? '',
    name:
      `${users[index]?.name?.first ?? ''} ${users[index]?.name?.last ?? ''}`.trim() ||
      'Unknown Instructor',
    email: users[index]?.email ?? '',
    picture: users[index]?.picture?.thumbnail ?? '',
  },
  isBookmarked: false,
}))
}