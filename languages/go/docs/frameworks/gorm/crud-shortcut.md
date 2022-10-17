# GORM CRUD shortcut

Refer below API shortcut.

```go
// Create

	user := User{Name: "Jinzhu", Age: 18, Birthday: time.Now()}
	result := db.Create(&user) // pass pointer of data to Create

	db.Omit("Name", "Age", "CreatedAt").Create(&user)
	// INSERT INTO `users` (`birthday`,`updated_at`) VALUES ("2020-01-01 00:00:00.000", "2020-07-04 11:05:21.775")

// Read/Query

	db.First(&user, 10)
	// SELECT * FROM users WHERE id = 10;

	db.Find(&users, []int{1,2,3})
	// SELECT * FROM users WHERE id IN (1,2,3);

// Update

	db.Model(&user).Where("active = ?", true).Update("name", "hello")
	// Select with Struct (select zero value fields)
	db.Model(&user).Select("Name", "Age").Updates(User{Name: "new_name", Age: 0})
	// UPDATE users SET name='new_name', age=0 WHERE id=111;

// Delete

	// soft delete:  Email's ID is `10`
	db.Delete(&email)
	// DELETE from emails where id = 10;

	// soft delete: Delete with additional conditions
	db.Where("name = ?", "jinzhu").Delete(&email)

	// db.Unscoped().Where("age = 20").Find(&users)
	// SELECT * FROM users WHERE age = 20;
```
