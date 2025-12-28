var express = require("express");
var router = express.Router();
const Contact = require("../../models/Contact");

// set layout cho admin
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

// List contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    const data = contacts.map((contact, index) => ({
      ...contact.toObject(),
      stt: index + 1,
    }));
    res.render("admin/contact/contact-list", { contacts: data });
  } catch (err) {
    console.error(err);
    res.send("Error loading contacts");
  }
});

// Create form
router.get("/create", (req, res) => {
  res.render("admin/contact/create");
});

// Create contact
router.post("/create", async (req, res) => {
  const contact = new Contact({
    title: req.body.title,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  });
  contact
    .save()
    .then(() => res.redirect("/admin/contact"))
    .catch((err) => {
      console.error(err);
      res.send("Create contact failed");
    });
});

// Edit form
// Edit form Contact
router.get("/edit/:id", (req, res) => {
  console.log("Editing contact ID:", req.params.id);
  Contact.findById(req.params.id)
    .then((contact) => {
      console.log("Found contact:", contact);
      res.render("admin/contact/edit", {
        title: "Sửa Liên Hệ",
        contact: contact ? contact.toObject() : {},
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("admin/contact/edit", { contact: {} });
    });
});

// Update contact
router.put("/edit/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.send("Contact not found");

    contact.title = req.body.title;
    contact.description = req.body.description;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.address = req.body.address;

    await contact.save();
    res.redirect("/admin/contact");
  } catch (err) {
    console.error(err);
    res.send("Update contact failed");
  }
});

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/admin/contact");
  } catch (err) {
    console.error(err);
    res.send("Delete contact failed");
  }
});

module.exports = router;
