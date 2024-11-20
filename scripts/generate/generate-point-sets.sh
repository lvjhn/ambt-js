
generate_for_seed () {
    seed=$1
    for dimensions in 2 3 5 10 50 100 300 
    do 
        for size in 100 1000 10000 50000 100000 300000 
        do 
            node scripts/generate/generate-point-set.js $seed $dimensions $size
        done 
    done 
}

# generate_for_seed 123456789
# generate_for_seed 987654321
# generate_for_seed 123459876
generate_for_seed 987612345

