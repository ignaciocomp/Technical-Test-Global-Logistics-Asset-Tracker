#include <stdio.h>
#include "health_score.h"

static void run_test(const char *name, double temp, double pressure, double vibration)
{
    double score = calculate_health_score(temp, pressure, vibration);
    printf("%-25s temp=%.0f  psi=%.0f  vib=%.0f  => score=%.1f\n",
           name, temp, pressure, vibration, score);
}

int main(void)
{
    printf("Health Score Library Tests\n");
    printf("=========================\n\n");

    run_test("Perfect conditions", 25.0, 85.0, 10.0);
    run_test("High temp + vibration", 80.0, 85.0, 50.0);
    run_test("Critical failure", 120.0, 200.0, 100.0);
    run_test("Normal wear", 30.0, 110.0, 35.0);

    return 0;
}
