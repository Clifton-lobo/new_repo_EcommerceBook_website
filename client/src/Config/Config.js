import React from 'react'

export const RegisterFormControl = [
    {
        name:'username',
        label:'User name',
        placeholder:'enter your name',
        componentType:'input',
        type:'text',
    },
    {
        name:'email',
        label:'email',
        placeholder:'enter your email',
        componentType:'input',
        type:'email',
    },{
        name:'password',
        label:'password',
        placeholder:'enter your password',
        componentType:'input',
        type:'password',
    },
]
  
export const LoginFormControl = [
    
    {
        name:'email',
        label:'email',
        placeholder:'enter your email',
        componentType:'input',
        type:'email',
    },{
        name:'password',
        label:'password',
        placeholder:'enter your password',
        componentType:'input',
        type:'password',
    },
]
  
export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "Fiction Book", label: "Fiction Book" },
        { id: "Comic Book", label: "Comic Book" },
        { id: "NCERT", label: "NCERT" },
        { id: "Medical books", label: "Medical" },
        { id: "Engineering books", label: "Engineering books" },
        { id: "Academic Books(10-12)", label: "Academic Books(10-12)" },
        { id: "Government exam", label: "Government exam" },
        // { id: " Novels", label: "Novels" },
        { id: " CAT", label: "CAT" },
      ],
    },
    {
      label: "author",
      name: "author",
      componentType: "input",
      type:"text",
      placeholder: "Enter Author's name",
    },
    {
      label: "Book Condition",
      name: "bookcondition",
      componentType: "select",
      options: [
        { id: "brandnew", label:"Brand New" },
        { id: "average", label:"Average" },
        { id: "almostnew", label:"almost New" },
        { id: "good", label:"Good" },
      ],
    },,
    {
      label: "language",
      name: "language",
      componentType: "input",
      type:"text",
      placeholder: "Enter Book language",
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];
  // UserView-HeaderMenu
  export const ShoppingViewHeaderMenu = [   
   
    {
      id:'fiction',
      label:'fiction',
      path:'/user/products',
   },{
    id:'Comic books',
    label:'Comic books',
    path:'/user/products',
    },{
     id:'NCERT',
     label:'NCERT',
     path:'/user/products',
   },{
     id:'Engineering books',
     label:'Engineering books  ',
     path:'/user/products',
   },{
     id:'Medical books',
     label:'Medical books',
     path:'/user/products',
   },{
     id:'CAT',
     label:'CAT',
     path:'/user/products',
   },{
     id:'Novels',
     label:'Novels',
     path:'/user/products',
   },{
     id:'Governement exam',
     label:'Governement exam',
     path:'/user/products',
   },{
       id:'home',
       label:'home',
       path:'/user/home',
    },
  ]

  // Author Filter Options
export const FilterOptions = {
  author:[
  { id: "jk_rowling", label: "J.K. Rowling" },
  { id: "dan_brown", label: "Dan Brown" },
  { id: "chetan_bhagat", label: "Chetan Bhagat" },
  { id: "george_orwell", label: "George Orwell" },
  { id: "agatha_christie", label: "Agatha Christie" },
  { id: "rk_narayan", label: "R.K. Narayan" }
],

// Language Filter Options
 language :[
  { id: "english", label: "english" },
  { id: "hindi", label: "hindi" },
  { id: "tamil", label: "tamil" },
  { id: "marathi", label: "marathi" },
  { id: "bengali", label: "bengali" }
],
// Book Condition Options
  bookcondition : [
  { id: "brandnew", label: "brandnew" },
  { id: "almostnew", label: "almostnew" },
  { id: "good", label: "good" },
  { id: "average", label: "average" }
],
} 

export const sortoptions = [
{ id: " ", label: "Price: Low to High" },
{id: "price-hightolow", label: "Price: High to Low" },
{id: "newest", label: "Newest" },
{id: "oldest", label: "Oldest" },
];


export const addressFormControls = [
  {
  label: "Address",
  name: "address",
  componentType: "input",
  type: "text",
  placeholder: "Enter your address",
  },
  {
  label: "City",
  name: "city",
  componentType: "input",
  type: "text",
  placeholder: "Enter your city",
  },
  {
  label: "Pincode",
  name: "pincode",
  componentType: "input",
  type: "text",
  placeholder: "Enter your pincode",
  },
  {
  label: "Phone",
  name: "phone",
  componentType: "input",
  type: "text",
  placeholder: "Enter your phone number",
  },
  {
  label: "Notes",
  name: "notes",
 componentType: "textarea",
  placeholder: "Enter any additional notes",
  },
  ];