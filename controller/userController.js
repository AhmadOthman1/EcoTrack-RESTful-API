


exports.postSignup=async (req,res,next)=>{
        return res.status(200).json({
            message: 'UserName already exists',
          });
}

exports.login=async (req,res,next)=>{
    return res.status(200).json({
        message: 'UserName already exists',
      });
}