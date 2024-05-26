import axios from "axios";

export async function checkBookExist(id: string): Promise<boolean> {
  try {
    const response = await axios.get(`http://localhost:8080/api/books/${id}`);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("No book with such id");
    return false;
  }
}
