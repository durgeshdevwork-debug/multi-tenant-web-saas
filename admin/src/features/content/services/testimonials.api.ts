import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { ApiEnvelope, Testimonial, TestimonialCollection } from "../types"

export async function listTestimonialCollections(): Promise<TestimonialCollection[]> {
  const res = await apiClient.get<ApiEnvelope<TestimonialCollection[]>>("/content/testimonials/collections")
  return unwrapEnvelope<TestimonialCollection[]>(res)
}

export async function listTestimonials(collectionId?: string): Promise<Testimonial[]> {
  const query = collectionId ? `?collectionId=${encodeURIComponent(collectionId)}` : ""
  const res = await apiClient.get<ApiEnvelope<Testimonial[]>>(`/content/testimonials${query}`)
  return unwrapEnvelope<Testimonial[]>(res)
}

export async function getTestimonial(id: string): Promise<Testimonial> {
  const res = await apiClient.get<ApiEnvelope<Testimonial>>(`/content/testimonials/${id}`)
  return unwrapEnvelope<Testimonial>(res)
}

export async function createTestimonial(payload: Testimonial): Promise<Testimonial> {
  const res = await apiClient.post<ApiEnvelope<Testimonial>>("/content/testimonials", payload)
  return unwrapEnvelope<Testimonial>(res)
}

export async function updateTestimonial(id: string, payload: Partial<Testimonial>): Promise<Testimonial> {
  const res = await apiClient.put<ApiEnvelope<Testimonial>>(`/content/testimonials/${id}`, payload)
  return unwrapEnvelope<Testimonial>(res)
}

export async function deleteTestimonial(id: string): Promise<{ deletedId: string }> {
  const res = await apiClient.delete<ApiEnvelope<{ deletedId: string }>>(`/content/testimonials/${id}`)
  return unwrapEnvelope<{ deletedId: string }>(res)
}
