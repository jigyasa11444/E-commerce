import Category from "../models/categoryModel.js"
import asyncHandler from "../middlewares/asyncHandler.js"

const createCategory = asyncHandler(async (req, res) => {
    try {

        const { name } = req.body;
        
        if(!name){
            return res.json().then(errorDate => {
                throw new Error (errorDate.error || `HTTP error! status: ${res.status}`)
            })
        }

        const existingCategory = await Category.findOne({ name });

        if(existingCategory) {
            return res.json({ error: "Already exists" })
        }

        const category = await new Category({ name }).save();
        res.json(category);

    } catch (error) {
        console.error(error)
        return res.status(400).json(error)
    }

  
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        const category = await Category.findOne({_id: categoryId})

        if(!category){
            return res.status(404).josn({error: "Category not found" });
        }

        category.name = name;

        const updateCategory = await category.save();
        res.json(updateCategory);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal server error "})
    }
})

const removeCategory = asyncHandler(async(req,res) => {
    try {
        const remove = await Category.findByIdAndDelete(req.params.categoryId)
        res.json(remove);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"})
    }
});

const listCategory = asyncHandler(async (req,res) => {
   try {
    const all = await Category.find({})
    res.json(all);
   } catch (error) {
    console.error(error);
    res.status(500).json(error.meassage

    )
    
   }
});

const readCategory = asyncHandler(async (req,res) => {
    try {
        
        const category = await Category.findOne({_id: req.params.id});
        res.json(category);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.meassage);
        
    }
})
export { createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory
};