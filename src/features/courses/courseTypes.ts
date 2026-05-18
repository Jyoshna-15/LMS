export interface Instructor {
  id: string
  name: string
  email: string
  picture: string
}

export interface Course {
  id: string
  title: string
  description: string
  price: number
  category: string
  thumbnail: string
  instructor: Instructor
  isBookmarked: boolean
}