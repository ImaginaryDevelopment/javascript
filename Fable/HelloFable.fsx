module Main

[<EntryPoint>]
let main argv = 
    if argv.Length = 0 then
        printfn "Please provide an argument"
        1
    else
        argv.[0]
        |> printfn "Hello %s"
        0