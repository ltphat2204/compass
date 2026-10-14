// Success announcements start with the outcome; historical saved-data errors are failures.
export const successMessagePattern=/^\s*(?!.*(?:không thể|không hợp lệ|không thành công|thất bại|lỗi|chưa lưu))(?:thành công|đã (?:lưu|thêm|xóa)|(?:lưu|thêm|xóa|cập nhật).*thành công)/i
