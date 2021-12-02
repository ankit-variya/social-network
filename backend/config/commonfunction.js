

exports._errorMassge = (res, Msg ) => {
     res.status(400).json({
        message: Msg
     })
}

exports._successMassage = (res, Data) => {
     res.status(200).json({
        message: "Action Perform Successfully",
        Data: Data
    })
}