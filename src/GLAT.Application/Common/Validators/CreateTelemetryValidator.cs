using FluentValidation;
using GLAT.Application.DTOs;

namespace GLAT.Application.Common.Validators;

public class CreateTelemetryValidator : AbstractValidator<CreateTelemetryRequest>
{
    public CreateTelemetryValidator()
    {
        RuleFor(x => x.Sensors).NotNull();
        RuleFor(x => x.Sensors.Temperature).NotNull();
        RuleFor(x => x.Sensors.Pressure).NotNull();
        RuleFor(x => x.Sensors.Vibration).NotNull();
    }
}
